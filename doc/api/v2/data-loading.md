# API and frontend data loading

For developers extending v2 to other entities, the project migration provides a
pattern for explicit API contracts, shared Redux ownership, and safe refreshes.
Use these concepts when designing readers for entities such as segments. For
implementation steps, see [Add a v2 API endpoint](adding-endpoints.md).

## Explicit read contracts

Lists return summaries with pagination; details return one record. Optional
`include` values add related data, while profiles distinguish display from
authorized editing representations. A cached summary does not prove that details
or an include have loaded. Keep common display fields lightweight and request
feature-specific collections separately.

Controllers validate parameters, establish project context, authorize access, and
render responses. Serializers define field allowlists and localization. Repositories
handle complex queries and aggregates; services handle multi-step behavior and
caching. The [Ruby OpenAPI definitions](../../../test/openapi/v2/schemas.rb) generate
the YAML contract, and tests validate actual responses against it.

Display strings use the requested locale with documented fallback. The editing
`translations` include retains stored values and translation IDs. These are different
representations: a fallback display value must not silently become an editable
translation.

## One owner for records and query results

Redux owns project data. Consumer hooks expose records, loading/error state, and
refresh without requiring components to know the storage or request mechanism.
Lists and details merge into the same records, preserving omitted fields and
other locales.

The main responsibilities under `state.data.projects` are:

| State | Responsibility |
| --- | --- |
| `records` | Shared fields by ID, with protected editing values kept separate |
| `translations` | Localized display values, editing values, and stored translations |
| `lists` | Ordered record IDs and pagination for each query |
| `requests` | Loading, errors, and evidence that the requested representation loaded |

A list reads its IDs from its query result, rather than displaying every cached
record. This preserves filters, ordering, and pagination when several lists or
detail pages share the store.

Projects also retain routing `identities` and legacy nested `resources`. These
support project routing and incremental migration; they are not requirements for
every future entity slice.

## Shared requests and safe refreshes

The [project request flow](../../../app/javascript/modules/data/redux/projectRequests.js)
normalizes request identity around the URL, account/access context, and an
invalidation counter. URLs distinguish locale, profile, includes, filters, and
pagination. Equivalent concurrent requests share a promise; selectors require a
matching successful request before treating a representation as loaded.

Ordinary saves mark affected queries for refresh while retaining displayed data,
so pages and forms stay mounted. Account or permission changes clear normalized
project content. Responses from an obsolete access context or invalidation
counter cannot restore it. Request cancellation is a separate concern; correctness
does not depend on cancellation completing.

Rails response caching is separate from Redux caching. Authorization runs before
cache lookup. Server keys combine normalized parameters, access, contract revision,
and dependencies covering the returned fields. Cache expiry alone is not the
freshness mechanism; see [response caching](README.md#server-side-response-caching).

## Bootstrap and incremental migration

Rails supplies authorized base display details for the umbrella and current
project under `data.projects`. JavaScript normalizes them before store creation,
using the same reducer as API reads. Only matching base-detail requests for that
locale start as loaded; lists, includes, and editing profiles remain on demand.

Project writes still use legacy endpoints. Their full response bodies do not
replace normalized records. Mutation actions trigger fresh reads through the
standard contract. Legacy nested-resource handling remains isolated until those
resources migrate too.

## Applying the pattern to segments

For a future segment API, keep segment records separate from each transcript or
search query's ordered IDs and pagination. Scope reads through the authorized
interview, preserving `archive_id` as its public identifier. Distinguish content
language from UI locale, and load annotations or registry references according to
their own size, access rules, and usage.

Reuse the ownership and request-safety principles, rather than copying every
project-specific helper. Test shared requests, partial-to-detail merging, list
isolation, localization, save freshness, denied access, and responses arriving
after logout or permission changes. Project code is a working example, not yet a
generic entity-loading framework.
