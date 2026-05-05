# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Home Assistant custom integration for StorageHub, a self-hosted
inventory system. Search-first: built around the "where is my X?"
use case via a Lovelace card and HA Assist voice queries.

This is a **v2.0 reboot** in progress. The v1 implementation (Dec
2025) was wiped; see `PLAN.md` for the phased rebuild and
`BACKEND_REQUIREMENTS.md` for the changes the StorageHub backend
needs to land in parallel.

## Current phase

**Phases 0–3 shipped.** Skeleton + search service + voice intent +
lite-index coordinator + Lovelace card all live. Backend issues
1–5 are all in. Phase 4 (polish: reauth/reconfigure end-to-end,
HACS validation, README rewrite) is the open work.

The Lovelace card lives in its own repo:
**[andymcflanders/storagehub-card](https://github.com/andymcflanders/storagehub-card)**.
This repo is integration-only.

## Project structure

```
ha-storagehunters/
├── PLAN.md                            # Phased rebuild plan
├── BACKEND_REQUIREMENTS.md            # Backend issue list
├── custom_components/storagehub/
│   ├── __init__.py                    # Setup + runtime_data + platforms
│   ├── manifest.json
│   ├── const.py
│   ├── api.py                         # Async API client + dataclasses
│   ├── coordinator.py                 # Heartbeat + Index coordinators
│   ├── config_flow.py                 # user / reauth / reconfigure
│   ├── sensor.py                      # total_items + diagnostic ETag
│   ├── binary_sensor.py               # connected
│   ├── services.py                    # search / semantic_search / search_lite / refresh_index
│   ├── services.yaml
│   ├── conversation.py                # HA Assist trigger
│   ├── strings.json
│   └── translations/{en,no}.json
├── tests/
│   ├── conftest.py
│   ├── test_api.py
│   ├── test_config_flow.py
│   ├── test_coordinator.py
│   ├── test_search_service.py
│   ├── test_search_lite_service.py
│   └── test_conversation.py
├── requirements_test.txt
├── pytest.ini
└── hacs.json
```

## StorageHub API endpoints used in phase 0

| Endpoint | Auth | Phase |
|---|---|---|
| `GET /api/ha/status` | none | 0 |
| `GET /api/ha/stats` | API key | 0 |
| `GET /api/ha/search?q=…` | API key | 1 |
| `GET /api/ha/items/index` | API key | 3 (after backend issue 2) |

See `../storagehunters/docs/API_DOCUMENTATION.md` for the canonical
backend API reference.

## Development commands

```bash
# Lint
ruff check custom_components/storagehub tests
ruff format custom_components/storagehub tests

# Type check
mypy custom_components/storagehub

# Tests
pip install -r requirements_test.txt   # one-time
pytest tests/
```

## HA conventions used here

- `entry.runtime_data` holds the `StorageHubData` dataclass — no
  `hass.data[DOMAIN]` global.
- `type StorageHubConfigEntry = ConfigEntry[StorageHubData]` aliases
  the typed entry.
- Coordinator passes `config_entry=` so HA can attach auth-failure
  handling automatically.
- Entities use `_attr_has_entity_name = True` and
  `translation_key`; user-facing strings live only in
  `translations/<lang>.json`, never hardcoded in Python.
- Config flow uses `_get_reauth_entry()` / `_get_reconfigure_entry()`
  (HA 2024.12+).
- Min HA version pinned in `hacs.json` — bump if a newer API is
  needed.

## Single-instance assumption

The plan locks single-instance support: one StorageHub per HA. Don't
add `entry_id` selectors to services or the card without revisiting
this decision.
