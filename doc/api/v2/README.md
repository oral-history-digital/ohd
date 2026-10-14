# API v2 contract

For backend and frontend development, use [openapi.yaml](openapi.yaml) to look up
the v2 API contract: parameters, defaults, response fields, nullability, pagination,
and JSON errors. Existing UI routes and legacy API responses have separate contracts.

The YAML is generated output. Edit the Ruby definitions, then regenerate it:

- [Global API information and generator configuration](../../../test/openapi_helper.rb)
- [Reusable response schemas](../../../test/openapi/v2/schemas.rb)
- [Project list parameters and responses](../../../test/openapi/v2/projects.rb)

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
