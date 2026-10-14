module ApiContract
  module V2
    class ProjectDetail
      include OpenapiRuby::Adapters::Minitest::DSL
      openapi_schema :openapi

      api_path '/api/v2/projects/{identifier}' do
        parameter name: :identifier, in: :path, required: true, schema: { type: :string, minLength: 1 },
          description: 'Decimal values resolve to numeric project IDs; other values resolve to exact shortnames. Independent of request host.'

        get 'Read project display details' do
          operationId :getProject
          produces 'application/json'
          description <<~TEXT
            Returns public display details after show authorization for the target project.
            Anonymous requests can read public projects. Project members with granted
            access, project role holders, and admins can read authorized unshared projects.
            Establishes target project context independently of the request host.
            Localized values use requested locale, project default, then first nonblank
            translation by translation ID. Editor fields and full translation maps are excluded.
            Supports extensionless and .json requests. Unsupported profiles return 400.
            Other unrecognized query parameters are ignored.
          TEXT
          parameter name: :locale, in: :query, schema: { type: :string, enum: %w[en de ru el es uk ar tr] },
            description: 'Defaults to the current request locale. Empty or unsupported values return 400; independent of project available_locales.'
          parameter name: :profile, in: :query, schema: { type: :string, enum: ['display'], default: 'display' },
            description: 'Only display is supported. Omitted and explicit display requests share the same contract.'
          parameter name: :include, in: :query,
            schema: { type: :string, pattern: '^\s*(counts|institutions|interview_languages|collection_preview)\s*(,\s*(counts|institutions|interview_languages|collection_preview)\s*)*$' },
            description: <<~TEXT
              Same optional fields as the list endpoint: counts adds interview_counts
              and collection_counts; other names add their matching fields. Defaults
              to no includes. Duplicate names, whitespace and any ordering are accepted.
              Empty, unknown and non-string values return 400. Collection previews are
              policy-scoped to the target project; aggregates retain catalog counting rules.
              Use include=institutions for ProjectHome's institution names.
            TEXT

          response 200, 'Authorized project display details' do
            header 'Content-Language', description: 'Effective response locale', schema: { type: :string }
            schema ProjectDetailResponse
          end
          response 400, 'Invalid locale, profile or include parameter' do
            schema InvalidParameterResponse
          end
          response 403, 'Existing project is not accessible' do
            schema ProjectReadErrorResponse
          end
          response 404, 'No project matches the identifier' do
            schema ProjectReadErrorResponse
          end
          response 406, 'An explicit non-JSON format' do
            schema FormatErrorResponse
          end
        end
      end
    end
  end
end
