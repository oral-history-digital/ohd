module ApiContract
  module V2
    class ProjectDetail
      include OpenapiRuby::Adapters::Minitest::DSL
      openapi_schema :openapi

      api_path '/api/v2/projects/{identifier}' do
        parameter name: :identifier, in: :path, required: true, schema: { type: :string, minLength: 1 },
          description: 'Decimal values resolve to numeric project IDs; other values resolve to exact shortnames. Independent of request host.'

        get 'Read project details' do
          operationId :getProject
          produces 'application/json'
          description <<~TEXT
            The default display profile requires show authorization for the target project.
            Anonymous requests can read public projects. Project members with granted
            access, project role holders, and admins can read authorized unshared projects.
            Establishes target project context independently of the request host.
            Localized values use requested locale, project default, then first nonblank
            translation by translation ID. The edit profile requires update permission
            and adds project settings. Shared field types remain unchanged. Only edit
            supports include=translations, returning stored translation records with IDs,
            all seven translated fields, and no locale fallback. Rich text must be sanitized
            before rendering. Related-record editors and mutation endpoints are separate.
            Supports extensionless and .json requests. Unsupported profiles return 400.
            Other unrecognized query parameters are ignored.
          TEXT
          parameter name: :locale, in: :query, schema: { type: :string, enum: %w[en de ru el es uk ar tr] },
            description: 'Defaults to the current request locale. Empty or unsupported values return 400; independent of project available_locales.'
          parameter name: :profile, in: :query, schema: { type: :string, enum: %w[display edit], default: 'display' },
            description: 'Display requires show permission; edit requires update permission, including for public projects. Omitted profile means display.'
          parameter name: :include, in: :query,
            schema: { type: :string, pattern: '^\s*(counts|institutions|interview_languages|collection_preview|media_types|year_ranges|subjects|levels_of_indexing|affiliates|access_config|metadata_fields|registry_configuration|playback|translations)\s*(,\s*(counts|institutions|interview_languages|collection_preview|media_types|year_ranges|subjects|levels_of_indexing|affiliates|access_config|metadata_fields|registry_configuration|playback|translations)\s*)*$' },
            description: <<~TEXT
              Same optional fields as the list endpoint: counts adds interview_counts
              and collection_counts; other names add their matching fields. Defaults
              to no includes. Duplicate names, whitespace and any ordering are accepted.
              Empty, unknown and non-string values return 400. Collection previews are
              policy-scoped to the target project; aggregates retain catalog counting rules.
              Use include=institutions for ProjectHome's institution names.
              Detail-only includes: media_types adds audio/video counts; year_ranges
              adds interview_year_range and birth_year_range; subjects and
              levels_of_indexing add localized umbrella registry labels linked to this
              project's interviews. Affiliates adds cooperation_partners, leaders,
              managers and funders with localized display names, ordered by ID.
              Access_config adds boolean registration field settings without user answers;
              edit additionally includes the save identifier. Missing configuration is null.
              Metadata_fields adds field definitions ordered by ID, localized labels,
              reference IDs, display flags and ordering. Derive grid fields using
              use_in_results_table and list columns using use_in_results_list, sorted
              by list_columns_order. No registry trees or interview values are included.
              Edit additionally returns use_in_metadata_import and stored label
              translations with IDs, preserving blanks and nulls without fallback.
              Registry_configuration adds root_registry_entry_id (null when absent),
              logged_out_visible_registry_entry_ids and hidden_registry_entry_ids.
              IDs in visibility arrays remain strings. These are UI settings, not
              authorization for registry records. Transcript visibility settings remain
              edit-only; existing edit settings are returned even without this include.
              Playback adds media_streams ordered by ID (including still images) and
              localized media_missing_text. Display streams contain id, media_type,
              resolution and suffix only. Clients build URLs through the existing
              media route; stream descriptors do not grant media or HLS-key access.
              Edit adds path templates and additionally requires MediaStream update
              permission. Missing streams return []; absent custom text returns null
              so clients can use their standard message. Full stored message translations
              remain available through the edit-only translations include.
              Media and year aggregates retain existing catalog rules: public projects
              include unshared interviews; other project states return zeros or null bounds.
              Requested empty data uses empty arrays, zero counts or null year bounds.
              Translations is accepted only with profile=edit; display requests return 400.
            TEXT

          response 200, 'Authorized project details for the requested profile' do
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
