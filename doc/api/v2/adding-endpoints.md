# Add a v2 API endpoint

For Rails developers adding endpoints under `/api/v2`, follow the project-list
implementation as a reference. Define the backend contract before migrating clients.

1. **Define the contract.** Specify parameters, defaults, field types/nullability,
   success/error responses, localization, and authorization. Lists use
   `{ data: [], pagination: { page, per_page, total_pages, total_count } }`.
   Keep optional includes additive and explicitly allowlisted.

2. **Add the route and controller.** Register routes in the existing `api/v2`
   namespace in [routes.rb](../../../config/routes.rb), outside UI locale/project
   scopes. Inherit from [BaseController](../../../app/controllers/api/v2/base_controller.rb)
   for JSON responses, locale handling, parameter helpers, and structured errors.
   Use `policy_scope` for lists and `authorize` for member actions. Establish the
   target project context before authorization. The project list's nil project
   context and anonymous access are specific to that global read; decide these
   deliberately for each endpoint.

3. **Separate queries and serialization.** Keep request parsing and rendering in
   the controller. Reuse repositories for complex queries and services for
   multi-step workflows; simple reads need neither. Put explicit response fields
   in `app/serializers/api/v2`, inheriting from `ActiveModel::Serializer` to avoid
   implicit legacy fields. See [ProjectListSerializer](../../../app/serializers/api/v2/project_list_serializer.rb).
   Use explicit translation fallback and scope related records through their
   policies. Paginate before loading associations and calculating optional data.

4. **Declare the OpenAPI operation in Ruby.** Add reusable schemas to
   [schemas.rb](../../../test/openapi/v2/schemas.rb) and an operation definition
   under `test/openapi/v2`, following [projects.rb](../../../test/openapi/v2/projects.rb).
   Require new definition files from [openapi_helper.rb](../../../test/openapi_helper.rb).
   Generate `openapi.yaml`; do not edit it manually.

5. **Use the shared cache convention.** For cached responses, use
   [ResponseCache.key/fetch](../../../app/services/api/v2/response_cache.rb).
   Supply normalized parameters, current access context, an endpoint revision,
   and dependencies covering every response field. Keep expensive queries and
   serialization inside the cache block. Check permissions before lookup and
   use the same allowed record IDs for the key and response. See
   [ProjectListCache](../../../app/services/api/v2/project_list_cache.rb) and the
   [caching rules](README.md#server-side-response-caching).

6. **Test the behavior and contract.** Add controller/serializer tests under
   `test/controllers/api/v2` and `test/serializers/api/v2`. Use
   [ApiSchemaAssertions](../../../test/support/api_schema_assertions.rb) for actual
   responses, including errors. Cover denied/cross-project access, locale
   fallback, invalid parameters, pagination, include combinations, and query
   growth as applicable. For caching, test reuse, mutation freshness, and access
   revocation. Update dependency fingerprints for added fields and bump the
   endpoint cache revision when serialization rules change.

Run generation and the v2 checks inside the development container:

```sh
bundle exec rake api:generate
bundle exec rails test test/controllers/api/v2 test/serializers/api/v2 test/services/api/v2
```

Confirm the generated YAML matches the Ruby definitions and run tests for any
shared repositories or services you changed. See the [contract guide](README.md)
for the existing list contract and validation details.
