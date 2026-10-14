module ApiContract
  module V2
    class Projects
      include OpenapiRuby::Adapters::Minitest::DSL

      openapi_schema :openapi

      api_path '/api/v2/projects' do
        get 'List visible project summaries' do
          operationId :listProjects
          produces 'application/json'
          description <<~TEXT
            Results follow the current account's project policy scope. Anonymous requests
            return public projects. The request host does not restrict the project list.
            Defaults to created_at descending, then ID descending. Use sort to change ordering.
            Both extensionless requests and the .json suffix are supported.
            Translated display values use the requested locale, then the project's
            default locale, then the first nonblank translation by translation ID.
            Optional includes and profiles are not supported by this operation;
            supplying either parameter returns 400. Other unrecognized query parameters are ignored.
          TEXT

          parameter name: :sort, in: :query,
            schema: { type: :string, enum: %w[name -name shortname -shortname created_at -created_at publication_date -publication_date id -id], default: '-created_at' },
            description: <<~TEXT
              Sorts before pagination. A leading minus selects descending order.
              Name uses the localized display_name, falling back to the localized name,
              with the same translation fallback as the response fields. Name sorting
              ignores leading punctuation and whitespace; response values are unchanged.
              Shortname sorts the routing identifier, not display_shortname.
              Text uses the database's
              case/accent-insensitive collation; publication_date sorts as stored text.
              Null names and publication dates sort last in either direction.
              ID breaks ties in the requested direction. Only one sort field is accepted.
            TEXT

          parameter name: :locale, in: :query,
            schema: { type: :string, enum: %w[en de ru el es uk ar tr] },
            description: <<~TEXT
              Defaults to the current request locale, initialized from the application
              default locale. It need not occur in a project's available_locales.
              Explicit empty or unsupported values return 400.
            TEXT

          parameter name: :page, in: :query,
            schema: { type: :integer, minimum: 1, default: 1 },
            description: <<~TEXT
              One-based page. Out-of-range pages return an empty data array and retain
              the requested page and actual totals. Cannot be supplied with all=true.
              Only positive decimal integer strings are accepted in the query string.
            TEXT

          parameter name: :per_page, in: :query,
            schema: { type: :integer, minimum: 1, maximum: 100, default: 25 },
            description: <<~TEXT
              Maximum results per page. Cannot be supplied with all=true.
              Only positive decimal integer strings are accepted in the query string.
            TEXT

          parameter name: :all, in: :query,
            schema: { type: :boolean, default: false },
            description: <<~TEXT
              Returns all matching projects in one page. Only the literal query values
              true and false are accepted. With true, page and per_page must be omitted,
              even if they contain default or empty values.
            TEXT

          parameter name: :include_umbrella, in: :query,
            schema: { type: :boolean, default: false },
            description: <<~TEXT
              Includes the umbrella project configured in instance settings, subject
              to the same policy scope. Only true and false are accepted.
            TEXT

          parameter name: :workflow_state, in: :query,
            schema: { type: :string, pattern: '^(all|\s*(public|unshared)\s*(,\s*(public|unshared)\s*)*)$', default: 'all' },
            example: 'public',
            description: <<~TEXT
              Filters the authorized results. Accepts public, unshared, comma-separated
              combinations of those states, or all for no additional filtering.
              Combinations may contain whitespace and repeated states. Empty or unknown
              states return 400. This filter never grants access to hidden projects.
            TEXT

          response 200, 'Visible project summaries and pagination metadata' do
            header 'Content-Language', description: 'Effective locale used for the response', schema: { type: :string }
            schema ProjectListResponse
          end

          response 400, 'An invalid or unsupported query parameter' do
            schema InvalidParameterResponse
            example 'application/json', value: {
              'error' => { 'code' => 'invalid_parameter', 'message' => 'Invalid value for per_page.', 'parameter' => 'per_page' },
            }
          end

          response 406, 'An explicit non-JSON format, such as .html' do
            schema FormatErrorResponse
          end
        end
      end
    end
  end
end
