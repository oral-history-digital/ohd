# API v2 contract

For backend and frontend development, use [openapi.yaml](openapi.yaml) to look up
the v2 API contract: parameters, defaults, response fields, nullability, pagination,
and JSON errors. Existing UI routes and legacy API responses have separate contracts.

To extend the API, follow [Add a v2 API endpoint](adding-endpoints.md).
For the reusable concepts behind project reads and Redux ownership, see
[API and frontend data loading](data-loading.md).

The YAML is generated output. Edit the Ruby definitions, then regenerate it:

- [Global API information and generator configuration](../../../test/openapi_helper.rb)
- [Reusable response schemas](../../../test/openapi/v2/schemas.rb)
- [Project list parameters and responses](../../../test/openapi/v2/projects.rb)
- [Project detail parameters and responses](../../../test/openapi/v2/project_detail.rb)

## Request catalog additions

Add optional catalog fields with the comma-separated `include` parameter:

```text
/api/v2/projects?all=true&workflow_state=public&include=counts,institutions,interview_languages,collection_preview
```

| Include | Fields added to each summary |
| --- | --- |
| `counts` | `interview_counts`, `collection_counts`: state breakdowns and totals |
| `institutions` | IDs, localized names, parent ID/name, and primary flag |
| `interview_languages` | Sorted, unique language codes such as `eng` |
| `collection_preview` | Collection IDs, localized names and notes for search |

Omitted includes add no fields or associated queries. Requested includes return
zero counts or empty arrays when there is no data. Unknown names, empty values,
and non-string values return `400`. Whitespace, duplicates, and any ordering are
accepted. Optional queries cover only projects on the returned page.

Counts and interview languages preserve the existing catalog aggregate rules:
interview counts include public, restricted, and unshared interviews in public
projects; other project states return zero interview counts and no languages.
Collection counts include public and restricted states, excluding unshared
collections. Collection previews follow collection policy scope, so unshared
preview records require permission even when an aggregate includes hidden data.

Nested translations follow the project summary fallback: requested locale,
project default, then the first nonblank translation by translation ID. Optional
record arrays are ordered by ID. Full collection records remain a separate read.

## Server-side response caching

[ResponseCache](../../../app/services/api/v2/response_cache.rb) defines the shared
v2 key format and 15-minute expiry. Keys contain the API namespace, endpoint,
contract revision, and a digest of normalized parameters, access context, and
data dependencies. Hash key order does not matter. Callers normalize set-like
parameters such as includes and workflow states; array order otherwise matters.
Use validated values rather than raw request parameters.

[ProjectReadCache](../../../app/services/api/v2/project_read_cache.rb) shares
dependencies across lists and details. Lists use current policy scopes on every
request and fix the allowed project and collection IDs for both the key and
the response. Entries are separate for anonymous requests and individual
accounts. Changed visibility changes the key without waiting for expiry.

Dependency fingerprints cover the stored values that affect the response,
including translations, branding attachments, and requested catalog additions.
SQL hashes avoid transferring full text fields or loading model objects during
these checks. Timestamps alone are insufficient because some legacy tables
store only whole seconds and Active Storage records have no `updated_at`.
Insertions, deletions, reassignment, and rapid edits also change fingerprints.

Cache hits still perform authorization and fingerprint queries. They skip list
sorting, pagination totals, metrics calculation, association loading, and
serialization. Dependencies cover all matching projects, so a change elsewhere
in the same filtered list can invalidate a cached page. Omitted includes have
no associated dependency queries. A null cache store skips fingerprinting.

Only successful response data is cached, using the existing Rails cache store.
This does not enable shared browser or proxy caching.

When adding a response field, update its dependency fingerprint. When changing
serialization or fallback rules, increment `REVISION` in the affected list,
display, or edit cache class so data from the previous contract cannot be reused.
Future endpoints should use
`ResponseCache.key`/`fetch` and declare their own dependencies and revision.

Details authorize before every lookup and use a separate cache identity with
extra display-field dependencies. Numeric ID and shortname aliases resolve to
the same identity. An administrator requesting `display` receives the same field
allowlist; authorization does not implicitly add editor data.

Run cache-specific tests inside the development container:

```sh
bundle exec rails test test/services/api/v2/response_cache_test.rb test/controllers/api/v2/project_list_caching_test.rb
```

## Validate a contract change

Run the following commands inside the development container.

1. Update the Ruby contract definitions with the intended API change.
2. Update the controller or serializer and its behavioral tests.
3. Regenerate the YAML and include it in your change:

   ```sh
   bundle exec rake api:generate
   ```

4. Run the focused tests:

   ```sh
   bundle exec rails test test/controllers/api/v2/projects_controller_test.rb test/serializers/api/v2/project_list_serializer_test.rb
   ```

The generator uses openapi-ruby and loads only contract declarations. It does not
boot the application, load test data, or send requests.

The tests check that the generated YAML matches the Ruby definitions and validate
the OpenAPI document itself. Actual JSON responses are checked against the Ruby
contract by operation, status, and content type through `assert_api_response_schema`
in [the test helper](../../../test/support/api_schema_assertions.rb). This also
validates error responses from deliberately invalid requests. Field allowlists
reject unexpected fields, including editor data in public summaries.

The existing Rails CI test command runs these checks. A stale YAML file fails with
the regeneration command; normal test runs do not overwrite it.

Keep behavior tests for authorization, localization, ordering, pagination totals,
and parameter combinations. Response schemas validate structure; they do not
establish that a record is authorized or that a calculated total is correct.
