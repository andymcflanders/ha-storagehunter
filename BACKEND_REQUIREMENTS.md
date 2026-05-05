# Backend Requirements for HA Integration Reboot

Hand this to the StorageHub backend agent. These are the changes the
Home Assistant integration needs in order to deliver a search-first UX:

- A Lovelace card with as-you-type filtering (sub-50ms per keystroke)
- A semantic fallback when the user pauses typing or hits Enter
- Voice queries via HA Assist (e.g. *"Where is Sverre's yellow winter
  jacket?"* → *"In the Winter box in the Attic"*)

All three issues touch `backend/app/api/homeassistant.py`. None of them
should require a database migration.

## Summary

| # | Title | Priority | Blocker for |
|---|-------|----------|-------------|
| 1 | Add owner to `/api/ha/search` matching | High | Voice queries with possessive ("Sverre's …") |
| 2 | New `GET /api/ha/items/index` lite endpoint | High | Card's instant as-you-type filter |
| 3 | Add `instance_id` to `/api/ha/status` | Low | HA `unique_id` stability across host changes |
| 4 | New `GET /api/ha/search/semantic` embedding-based endpoint | Medium | Card "Smart matches" actually being smart; voice queries that don't share substrings with indexed text |

**Status (2026-05-05):** issues 1, 2, 3 shipped and verified end-to-end against the HA integration's Phase 0–3 surface. Issue 4 is open.

---

## Issue 1 — Add owner to semantic search

**Where:** `backend/app/api/homeassistant.py`, `search_items` function
(around line 603).

**Problem:** The current WHERE clause matches the query against
`Item.name`, `Item.description`, `Item.ai_names`, and `Item.ai_descriptions`,
but **not the owner's name**. A voice query like *"Where is Sverre's
jakke?"* therefore returns every jacket in the system, not just
Sverre's.

```python
# current (homeassistant.py:624)
where = (
    func.lower(Item.name).like(search_term)
    | func.lower(Item.description).like(search_term)
    | func.lower(func.cast(Item.ai_names, Text)).like(search_term)
    | func.lower(func.cast(Item.ai_descriptions, Text)).like(search_term)
)
```

**Suggested change:** Tokenize the query, strip possessive `'s` /
Norwegian `s` from each token, and require **all tokens** to match
**any field** (the owner name being one of them). This naturally lets
"Sverre jakke" find Sverre's jackets without a special owner param.

```python
# rough sketch — adapt to your style
tokens = [t.rstrip("'s").rstrip("s") for t in q.lower().split() if len(t) >= 2]
# join Item.owner so owner.name is searchable
query = select(Item).join(Item.owner, isouter=True)...
for token in tokens:
    pat = f"%{token}%"
    query = query.where(
        func.lower(Item.name).like(pat)
        | func.lower(Item.description).like(pat)
        | func.lower(func.cast(Item.ai_names, Text)).like(pat)
        | func.lower(func.cast(Item.ai_descriptions, Text)).like(pat)
        | func.lower(User.name).like(pat)
    )
```

**Acceptance criteria:**
- `GET /api/ha/search?q=Sverre+jakke` returns only items where owner
  name contains "Sverre" AND name/description/ai\_\* contains "jakke".
- `GET /api/ha/search?q=Sverres+jakke` (possessive) behaves the same.
- Existing single-token queries (`?q=jakke`) still match all jackets.
- Watch out for the AI multi-language fields — the current cast-to-Text
  approach should keep working.

---

## Issue 2 — New `GET /api/ha/items/index` lite endpoint

**Why:** The HA Lovelace card needs to filter items as the user types,
with no per-keystroke network round-trip. The plan is to pre-load a
minimal index once on card load (and refresh occasionally), then
substring-filter in JavaScript. Calling `/api/ha/search` per keystroke
is too slow; pre-loading `/api/ha/items` is too heavy (it includes
images, tags, descriptions, owner objects, etc.).

**Suggested API:**

```
GET /api/ha/items/index
Headers:
  X-API-Key: shub_...
  If-None-Match: "<etag>"   (optional)

Response 200 OK:
Content-Type: application/json
ETag: "abc123"
Cache-Control: private, max-age=900

[
  {
    "id": "uuid",
    "name": "Red wool cardigan",
    "owner_name": "Sverre",            // null if no owner
    "container_name": "Winter Box",    // null if uncontained
    "location_name": "Attic",          // null if container has no location
    "ai_names": ["Rød ullgenser"]      // values only, all languages flattened
  },
  ...
]

Response 304 Not Modified:
(empty body, when If-None-Match matches current ETag)
```

**Required scope:** `read`.

**Implementation notes:**
- One SQL query, three LEFT JOINs (item → container → location, item →
  user). No `selectinload` of images, tags, or full container objects.
- `ai_names` is the JSONB dict's *values* concatenated into a list —
  the card doesn't care which language each name is in, it just wants
  searchable strings.
- ETag can be the `MAX(updated_at)` across `items`, `containers`,
  `locations`, `users` (whichever invalidates the cached index), hashed
  to keep it short. Simpler alternative: a monotonic counter bumped by
  any mutation.
- Enable gzip via the existing FastAPI middleware. Target wire size
  under 200 KB for a 10k-item inventory.

**Acceptance criteria:**
- Returns minimal item data for *all* items the API key can see.
- Returns `ETag`; returns 304 when client sends matching `If-None-Match`.
- Response under 1 MB ungzipped for 10k items; under 200 KB gzipped.
- No image URLs, no tag arrays, no descriptions — keep it tight.
- 4xx if API key lacks `read` scope.

---

## Issue 3 — Add `instance_id` to `/api/ha/status`

**Why:** The HA integration currently uses the host URL as its
`unique_id`. If a user reconfigures from `http://storagehub.local` to
`https://storagehub.example.com`, HA forks a new config entry instead
of updating the existing one (orphaning all entities, history, and
automations referencing the old entry). A stable instance UUID fixes
this — HA can detect "same instance, new URL" and migrate.

**Suggested change:** Add `instance_id: UUID` to the `SystemStatus`
response model (`homeassistant.py:34`). Generate once on first boot,
persist in the DB.

```python
class SystemStatus(BaseModel):
    status: str = "online"
    version: str = "1.0.0"
    api_version: str = "v1"
    name: str = "StorageHub"
    instance_id: str  # NEW — stable UUID, persisted in DB
```

**Storage:** A one-row `instance` table, or a row in an existing
settings/config table — whatever fits the existing pattern. Generate
on first boot, never rotate.

**Acceptance criteria:**
- `GET /api/ha/status` (still no auth) returns `instance_id` as a UUID
  string.
- The same UUID survives container restarts, image rebuilds, and HTTPS
  reconfiguration.
- The UUID changes only when the database is wiped.

---

## Issue 4 — Embedding-based `/api/ha/search/semantic` endpoint

**Where:** new route in `backend/app/api/homeassistant.py`, alongside the
existing `search_items`. Reuses whatever embedding pipeline already
backs StorageHub's web UI semantic search.

**Problem:** PLAN.md and BACKEND_REQUIREMENTS.md repeatedly call
`/api/ha/search` "semantic," but it's actually multi-token substring
matching across `name`, `description`, `ai_names`, `ai_descriptions`,
and `owner.name` (issue 1). It can't bridge synonyms or cross-language
meaning.

Concrete failure on the deployed instance (`http://192.168.200.13`,
2026-05-05):

```bash
curl -H "X-API-Key: shub_..." "$B/api/ha/search?q=genser"
# → {"items":[],"total_count":0,...}
```

But the StorageHub web UI returns "Hvit Oasis Cardigan" for the same
query — Norwegian *genser* (sweater/jumper) maps semantically to
*cardigan* via the embedding pipeline. The HA card's "Smart matches"
section sits below the lite-index local hits expecting *exactly*
this kind of fallback (where local substring missed but the semantic
layer fills in). Today it never adds anything beyond what local
already found.

**Suggested API:**

```
GET /api/ha/search/semantic?q=<text>&limit=N
Headers:
  X-API-Key: shub_...

Response 200 OK:
{
  "items": [<ItemSummary>, ...],
  "total_count": int,
  "query": "<echoed>"
}
```

Same response shape as `/api/ha/search` — the HA integration already
has a `SearchResult` dataclass. Drop-in compatible.

**Suggested behavior:**

1. **Embedding-based ranking.** Embed the query with the same model
   StorageHub uses to embed `ai_names` / `ai_descriptions`. Return
   top-N items by similarity. A modest similarity floor (e.g. cosine
   ≥ 0.35, tunable) keeps "I couldn't find anything close" from
   surfacing nonsense.
2. **Owner-aware filtering, same as issue 1.** Reuse the tokenizer
   from `search_items` to extract candidate owner-name tokens
   (English `'s`, Norwegian possessive `s` ≥ 4 chars). If any token
   matches a `User.name` (substring, case-insensitive), filter
   results to that user before semantic ranking. Without this, voice
   queries like *"Hvor er Sverres ullgenser"* would return any
   sweater in the household, not Sverre's. The lexical owner filter
   is cheap; layering it under semantic ranking is the right order.
3. **Empty-token / very-short query.** Return `{"items": [], ...}`
   without raising. The HA integration enforces ≥ 2 chars at the
   service layer, but defensive parity matches issue 1's contract.
4. **Required scope:** `search` (same as `/api/ha/search`).

**Why a separate endpoint over a flag on `/api/ha/search`:**

- Embedding lookup has a different perf profile than substring
  matching (typically vector index, possibly remote inference).
  Keeping the cheap path cheap means the as-you-type local
  fallback in `/api/ha/search` (debounced, called once per pause)
  doesn't get accidentally upgraded to the heavy path.
- Result ordering is fundamentally different: substring counts
  matches, semantic scores similarity. Mixing them in one endpoint
  forces awkward "which sort?" decisions.
- Callers can choose: voice uses semantic for the broadest
  understanding; the card uses it only for the post-debounce "Smart
  matches" merge.

**Acceptance criteria:**

- `GET /api/ha/search/semantic?q=genser` on the test instance
  returns *Hvit Oasis Cardigan* (and any other knit-tops) even
  though no field on those items literally contains "genser".
- `GET /api/ha/search/semantic?q=Sverre+genser` returns only
  Sverre's knit tops, not the household's. (Owner pre-filter.)
- `GET /api/ha/search/semantic?q=Sverres+genser` (Norwegian
  possessive) behaves the same as the previous query.
- Returns within the same latency envelope as `/api/ha/search` for
  reasonable inventories (the card debounces 400ms, voice tolerates
  ~1s — beyond that we'd have to surface a "thinking…" indicator).
- 401/403 if API key lacks `search` scope.
- Empty-or-no-match returns 200 with `{"items": [], "total_count": 0}`.

**Implementation note (not blocking acceptance):** if the embedding
pipeline isn't currently wired into a queryable index, a pragmatic
first cut is to compute query embeddings on the fly and brute-force
cosine against all item embeddings. For the inventory sizes we're
designing for (≤ 10k items per household), brute force is fine; a
proper vector index can come later.

---

## What's intentionally NOT on this list

- **Triage / outgrown / owner-suggestion endpoints in `/api/ha/*`.**
  Out of scope for the search-first reboot. Revisit later.
- **Webhooks / push events.** The integration will keep polling for
  the lightweight `total_items` heartbeat; real-time push isn't worth
  the complexity until search works well.
- **A "format the answer as natural language" flag on
  `/api/ha/search`.** HA templates can render *"in the Winter box in
  the Attic"* from the existing structured response.

---

## Testing the integration end-to-end

Once issues 1 and 2 ship, the HA agent will pull data with these calls.
A working setup means:

```bash
# Issue 3
curl http://storagehub.local/api/ha/status
# → {"status":"online", ..., "instance_id":"<uuid>"}

# Issue 2
curl -H "X-API-Key: shub_..." http://storagehub.local/api/ha/items/index
# → [{"id":"...","name":"...","owner_name":"...","container_name":"...","location_name":"...","ai_names":[...]}, ...]

curl -H "X-API-Key: shub_..." -H 'If-None-Match: "<etag>"' \
     http://storagehub.local/api/ha/items/index
# → 304 (when nothing changed)

# Issue 1
curl -H "X-API-Key: shub_..." \
     "http://storagehub.local/api/ha/search?q=Sverre+jakke"
# → only Sverre's jackets, not the household's

# Issue 4
curl -H "X-API-Key: shub_..." \
     "http://storagehub.local/api/ha/search/semantic?q=genser"
# → cardigans / knit tops, even though no field contains "genser"
```
