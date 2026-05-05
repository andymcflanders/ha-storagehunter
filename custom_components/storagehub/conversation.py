"""Voice/Assist trigger for StorageHub.

Wires HA Assist to the search backend through the conversation
component's `register_trigger` API. Sentences and response templates
both live in this module — HA's translation helper is for UI strings
shown by the framework, not runtime templates an integration renders
itself.
"""

from __future__ import annotations

from collections import Counter
import logging
from typing import TYPE_CHECKING

from hassil.recognize import RecognizeResult
from homeassistant.components.conversation import get_agent_manager
from homeassistant.components.conversation.models import ConversationInput
from homeassistant.core import HomeAssistant, callback

from .api import (
    CannotConnect,
    InvalidAuth,
    SearchResult,
    SearchResultItem,
    StorageHubError,
)
from .const import DOMAIN

if TYPE_CHECKING:
    from . import StorageHubData

_LOGGER = logging.getLogger(__name__)

# hassil patterns. `{item}` becomes a wildcard slot automatically
# (default_agent.py:_collect_list_references). Bracketed words are
# optional. Both languages live in one list — hassil's recognize_all
# tries every sentence regardless of HA's configured language.
_TRIGGER_SENTENCES: list[str] = [
    # English
    "where is [the] {item}",
    "where's [the] {item}",
    "find [the|my] {item}",
    "locate [the] {item}",
    "show me [the] {item}",
    # Norwegian
    "hvor er [den|det] {item}",
    "hvor ligger [den|det] {item}",
    "finn [min|mitt] {item}",
]

_TEMPLATES_EN: dict[str, str] = {
    "found_with_owner": "{owner}'s {name} is in the {container} box in the {location}.",
    "found": "The {name} is in the {container} box in the {location}.",
    "found_no_container": "The {name} is in the {location}.",
    "multi_one_loc_one_box": "All {count} matches are in the {container} box in the {location}.",
    "multi_one_loc_spread": "All {count} matches are in the {location}, across several boxes.",
    "multi_dominant_loc": "Mostly in the {location}; the rest in the {other}.",
    "multi_spread": "Spread across {locations}.",
    "no_results": "I couldn't find a {item} in your inventory.",
    "error_cannot_connect": "I couldn't reach StorageHub.",
    "error_auth": "StorageHub rejected my API key. Please reconfigure the integration.",
    "error_generic": "StorageHub returned an error.",
    "not_configured": "StorageHub isn't configured yet.",
}

_TEMPLATES_NO: dict[str, str] = {
    "found_with_owner": "{owner}s {name} ligger i boksen {container} på {location}.",
    "found": "{name} ligger i boksen {container} på {location}.",
    "found_no_container": "{name} ligger på {location}.",
    "multi_one_loc_one_box": "Alle {count} treff ligger i boksen {container} på {location}.",
    "multi_one_loc_spread": "Alle {count} treff ligger på {location}, fordelt på flere bokser.",
    "multi_dominant_loc": "Stort sett på {location}; resten på {other}.",
    "multi_spread": "Fordelt på {locations}.",
    "no_results": "Jeg fant ingen {item} i inventaret.",
    "error_cannot_connect": "Jeg når ikke StorageHub.",
    "error_auth": "StorageHub avviste API-nøkkelen. Rekonfigurer integrasjonen.",
    "error_generic": "StorageHub returnerte en feil.",
    "not_configured": "StorageHub er ikke konfigurert ennå.",
}


def _templates_for(language: str | None) -> dict[str, str]:
    """Pick the template bundle for a language (norm: prefix match on 'no')."""
    if language and language.lower().startswith("no"):
        return _TEMPLATES_NO
    return _TEMPLATES_EN


def _query_mentions_owner(query: str, owner_name: str) -> bool:
    """Return True if any token of `query` looks like `owner_name`.

    Catches English `Sverre's` and Norwegian `Sverres` via prefix matching
    on the lowercased owner name. Light-touch — keeps us out of NLP land.
    """
    if not owner_name:
        return False
    owner_lc = owner_name.lower()
    for token in query.lower().split():
        token = token.rstrip("'s").rstrip("s")
        if token == owner_lc or owner_lc.startswith(token) and len(token) >= 3:
            return True
        if token.startswith(owner_lc):
            return True
    return False


def _format_response(
    result: SearchResult,
    item_text: str,
    language: str | None,
) -> str:
    templates = _templates_for(language)
    if result.total_count == 0:
        return templates["no_results"].format(item=item_text)

    items = result.items
    top = items[0]

    # Single-result fallthrough: only one item, or every sampled item shares
    # the top item's container — they all answer the "where is X" question
    # identically, so just speak the top result.
    if len(items) <= 1 or all(it.container_name == top.container_name for it in items):
        return _render_single(top, item_text, templates)

    return _render_aggregate(result, templates, language)


def _render_single(
    top: SearchResultItem, item_text: str, templates: dict[str, str]
) -> str:
    container = top.container_name
    location = top.location_name or "an unknown location"
    if not container:
        return templates["found_no_container"].format(name=top.name, location=location)
    if top.owner_name and _query_mentions_owner(item_text, top.owner_name):
        return templates["found_with_owner"].format(
            owner=top.owner_name,
            name=top.name,
            container=container,
            location=location,
        )
    return templates["found"].format(
        name=top.name, container=container, location=location
    )


def _render_aggregate(
    result: SearchResult, templates: dict[str, str], language: str | None
) -> str:
    """Summarise multi-item results by *where they live*, not by listing names.

    Three buckets:
      - All sampled items in one location → mention dominant box if any
      - One location dominates (>60%) → "mostly in X; the rest in Y"
      - Spread → list top 2-3 locations

    The voice client requests up to 20 items, so for typical voice queries
    the sampled set is the full set; the aggregation is exact. For larger
    result sets we still pick the right bucket from the sample and phrase
    in a way that doesn't claim more certainty than we have.
    """
    items = result.items
    location_counts = Counter(it.location_name for it in items if it.location_name)
    sample_size = len(items)

    # Defensive: no usable location info at all → fall back to top item.
    if not location_counts:
        return _render_single(items[0], "", templates)

    top_loc, top_loc_count = location_counts.most_common(1)[0]
    full_set = result.total_count == sample_size

    # Bucket 1: every sampled item lives in the top location.
    if top_loc_count == sample_size and full_set:
        containers = Counter(it.container_name for it in items if it.container_name)
        if containers:
            top_container, top_container_count = containers.most_common(1)[0]
            if top_container_count > sample_size / 2:
                return templates["multi_one_loc_one_box"].format(
                    count=result.total_count,
                    container=top_container,
                    location=top_loc,
                )
        return templates["multi_one_loc_spread"].format(
            count=result.total_count, location=top_loc
        )

    # Bucket 2: one location dominates (>60% of sample).
    if top_loc_count / sample_size > 0.6:
        other_locs = [loc for loc, _ in location_counts.most_common() if loc != top_loc]
        # other_locs is non-empty here because we're not in bucket 1.
        return templates["multi_dominant_loc"].format(
            location=top_loc, other=other_locs[0]
        )

    # Bucket 3: spread across multiple locations.
    top_locs = [loc for loc, _ in location_counts.most_common(3)]
    return templates["multi_spread"].format(
        locations=_join_locations(top_locs, language)
    )


def _join_locations(locs: list[str], language: str | None) -> str:
    """Render a 1-3 location list with the right conjunction."""
    if not locs:
        return ""
    if len(locs) == 1:
        return locs[0]
    conj = "og" if language and language.lower().startswith("no") else "and"
    return ", ".join(locs[:-1]) + f" {conj} " + locs[-1]


_REGISTERED_KEY = f"{DOMAIN}_conversation_registered"


def _register_trigger(hass: HomeAssistant, sentences: list[str], handler) -> None:
    """Register a sentence trigger across HA versions.

    HA 2025.10 moved register_trigger from DefaultAgent to AgentManager
    and removed the DATA_DEFAULT_ENTITY constant. Both versions still
    expose `get_agent_manager`, so the manager is the stable handle —
    we just probe for the method.
    """
    manager = get_agent_manager(hass)
    if hasattr(manager, "register_trigger"):
        manager.register_trigger(sentences, handler)
        return

    # HA <= 2025.9 fallback: trigger lived on DefaultAgent.
    from homeassistant.components.conversation.const import (  # noqa: PLC0415
        DATA_DEFAULT_ENTITY,
    )

    hass.data[DATA_DEFAULT_ENTITY].register_trigger(sentences, handler)


async def async_register_conversation(hass: HomeAssistant) -> None:
    """Register our voice trigger on the default conversation agent."""
    if hass.data.get(_REGISTERED_KEY):
        return
    _register_trigger(hass, _TRIGGER_SENTENCES, _build_handler(hass))
    hass.data[_REGISTERED_KEY] = True


def _build_handler(hass: HomeAssistant):
    @callback
    async def _handle(
        user_input: ConversationInput, result: RecognizeResult
    ) -> str | None:
        item_text = result.entities["item"].text.strip()
        templates = _templates_for(user_input.language)

        entries = hass.config_entries.async_loaded_entries(DOMAIN)
        if not entries:
            return templates["not_configured"]

        data: StorageHubData = entries[0].runtime_data
        try:
            # Limit 20 — multi-item aggregation needs enough sample to detect
            # location dominance. For typical voice queries this is the full
            # result set, making the aggregation exact rather than estimated.
            search_result = await data.client.async_semantic_search(item_text, limit=20)
        except InvalidAuth:
            return templates["error_auth"]
        except CannotConnect:
            return templates["error_cannot_connect"]
        except StorageHubError:
            _LOGGER.exception("StorageHub search failed for voice query %r", item_text)
            return templates["error_generic"]

        return _format_response(search_result, item_text, user_input.language)

    return _handle
