# API v2 contract

For backend and frontend development, use [openapi.yaml](openapi.yaml) to look up
the v2 API contract: parameters, defaults, response fields, nullability, pagination,
and JSON errors. Existing UI routes and legacy API responses have separate contracts.

The YAML is generated output. Edit the Ruby definitions, then regenerate it:

- [Global API information and generator configuration](../../../test/openapi_helper.rb)
- [Reusable response schemas](../../../test/openapi/v2/schemas.rb)
- [Project list parameters and responses](../../../test/openapi/v2/projects.rb)

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
