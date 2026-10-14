module ApiContract
  module V2
    class ProjectSummary
      include OpenapiRuby::Components::Base

      schema(
        type: :object,
        additionalProperties: false,
        description: <<~TEXT,
          All listed keys are present. Nullable fields remain null when no value is
          configured. Names and introduction contain localized strings, not translation
          maps. Records without any nonblank name translation can have name=null.
          Editor fields, full translations, counts, and related records are excluded.
        TEXT
        required: %w[id shortname is_umbrella name display_name display_shortname
          archive_domain workflow_state publication_date available_locales default_locale
          introduction logo favicon_url grant_access_without_login grant_project_access_instantly],
        properties: {
          id: { type: :integer, minimum: 1 },
          shortname: { type: :string, description: 'Project identifier used by UI routes' },
          is_umbrella: { type: :boolean },
          name: { type: %w[string null] },
          display_name: { type: %w[string null] },
          display_shortname: { type: %w[string null], description: 'Optional label, independent of the routing shortname' },
          archive_domain: { type: %w[string null], description: 'Dedicated archive domain; blank stored values become null' },
          workflow_state: { type: :string, enum: %w[public unshared] },
          publication_date: { type: %w[string null], description: 'Stored publication label; not an ISO date value' },
          available_locales: { type: :array, items: { type: :string } , description: 'Locales available for the project (ISO 639-1 language codes)' },
          default_locale: { type: %w[string null], description: 'Default locale for the project (ISO 639-1 language code); null if no default is set' },
          introduction: { type: %w[string null], description: 'Localized rich text; consumers must sanitize before rendering HTML' },
          logo: {
            type: %w[object null],
            additionalProperties: false,
            description: <<~TEXT,
              Logo for the requested locale, then the project default locale, then
              the first logo by ID. Null if the selected logo has no attachment.
            TEXT
            required: %w[id url],
            properties: {
              id: { type: :integer, minimum: 1 },
              url: { type: :string, description: 'Relative attachment URL' },
            },
          },
          favicon_url: { type: %w[string null], description: 'Relative attachment URL, or null when no favicon is attached' },
          grant_access_without_login: { type: :boolean, description: 'Whether project access is granted without login; unset means false' },
          grant_project_access_instantly: { type: :boolean, description: 'Whether logged-in users receive project access immediately; unset means false' },
        },
      )
    end

    class Pagination
      include OpenapiRuby::Components::Base

      schema(
        type: :object,
        additionalProperties: false,
        description: <<~TEXT,
          In paginated mode, total_pages is zero for an empty result. With all=true,
          page and total_pages are 1 and per_page equals total_count, including zero
          for an empty result. Totals reflect policy scope and filters.
        TEXT
        required: %w[page per_page total_pages total_count],
        properties: {
          page: { type: :integer, minimum: 1 },
          per_page: { type: :integer, minimum: 0 },
          total_pages: { type: :integer, minimum: 0 },
          total_count: { type: :integer, minimum: 0 },
        },
      )
    end

    class ProjectListResponse
      include OpenapiRuby::Components::Base

      schema(
        type: :object,
        additionalProperties: false,
        required: %w[data pagination],
        properties: {
          data: { type: :array, items: ProjectSummary },
          pagination: Pagination,
        },
      )
    end

    class InvalidParameterResponse
      include OpenapiRuby::Components::Base

      schema(
        type: :object,
        additionalProperties: false,
        required: %w[error],
        properties: {
          error: {
            type: :object,
            additionalProperties: false,
            required: %w[code message parameter],
            properties: {
              code: { const: 'invalid_parameter' },
              message: { type: :string, minLength: 1 },
              parameter: { type: :string, minLength: 1 },
            },
          },
        },
      )
    end

    class FormatErrorResponse
      include OpenapiRuby::Components::Base

      schema(
        type: :object,
        additionalProperties: false,
        required: %w[error],
        properties: {
          error: {
            type: :object,
            additionalProperties: false,
            required: %w[code message],
            properties: {
              code: { const: 'not_acceptable' },
              message: { type: :string, minLength: 1 },
            },
          },
        },
      )
    end
  end
end
