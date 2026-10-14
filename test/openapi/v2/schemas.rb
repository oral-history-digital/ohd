module ApiContract
  module V2
    class InterviewCounts
      include OpenapiRuby::Components::Base

      schema(
        type: :object, additionalProperties: false,
        description: 'Catalog aggregates for public projects, including unshared interview counts. Other project states return zeros.',
        required: %w[public restricted unshared total],
        properties: %w[public restricted unshared total].to_h { |key| [key, { type: :integer, minimum: 0 }] },
      )
    end

    class CollectionCounts
      include OpenapiRuby::Components::Base

      schema(
        type: :object, additionalProperties: false,
        description: 'Catalog aggregates include public and restricted states, not unshared collections. Independent of preview visibility.',
        required: %w[public restricted total],
        properties: %w[public restricted total].to_h { |key| [key, { type: :integer, minimum: 0 }] },
      )
    end

    class ProjectInstitution
      include OpenapiRuby::Components::Base

      schema(
        type: :object, additionalProperties: false, required: %w[id name parent is_primary],
        properties: {
          id: { type: :integer, minimum: 1 },
          name: { type: %w[string null] },
          is_primary: { type: :boolean, description: 'First primary institution by link ID, or lowest institution ID if none is primary' },
          parent: {
            type: %w[object null], additionalProperties: false, required: %w[id name],
            properties: { id: { type: :integer, minimum: 1 }, name: { type: %w[string null] } },
          },
        },
      )
    end

    class CollectionPreview
      include OpenapiRuby::Components::Base

      schema(
        type: :object, additionalProperties: false, required: %w[id name notes],
        description: 'Search metadata for a policy-visible collection; not a complete collection record',
        properties: {
          id: { type: :integer, minimum: 1 },
          name: { type: %w[string null] },
          notes: { type: %w[string null] },
        },
      )
    end

    class ProjectSummary
      include OpenapiRuby::Components::Base

      schema(
        type: :object,
        additionalProperties: false,
        description: <<~TEXT,
          All required keys are present. Nullable fields remain null when no value is
          configured. Names and introduction contain localized strings, not translation
          maps. Records without any nonblank name translation can have name=null.
          Editor fields and full translations are excluded. Optional include fields
          are omitted unless requested; requested fields use zero counts or empty
          arrays when no data is available. Nested names and notes use the same
          translation fallback as project fields. Arrays of records are ordered by ID.
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
          interview_counts: InterviewCounts,
          collection_counts: CollectionCounts,
          institutions: { type: :array, items: ProjectInstitution },
          interview_languages: {
            type: :array, uniqueItems: true, items: { type: :string },
            description: 'Sorted language codes such as eng, from public/restricted/unshared interviews in public projects; other project states return an empty array',
          },
          collection_preview: { type: :array, items: CollectionPreview },
        },
      )
    end

    class ProjectDisplay < ProjectSummary
      schema(
        description: 'Localized public display details, including the fields used by ProjectHome. Institutions remain an optional include.',
        required: %w[domain more_text primary_color secondary_color editorial_color has_map is_catalog has_newsletter display_ohd_link oai_doi_identifier],
        properties: {
          domain: { type: %w[string null] },
          more_text: { type: %w[string null], description: 'Localized rich text; sanitize before rendering HTML' },
          primary_color: { type: %w[string null] },
          secondary_color: { type: %w[string null] },
          editorial_color: { type: %w[string null] },
          has_map: { type: :boolean },
          is_catalog: { type: :boolean },
          has_newsletter: { type: :boolean },
          display_ohd_link: { type: :boolean },
          oai_doi_identifier: { type: %w[string null], description: 'DOI URL only when doi_status is created; otherwise null' },
        },
      )
    end

    class ProjectDetailResponse
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[data], properties: { data: ProjectDisplay })
    end

    class ProjectReadErrorResponse
      include OpenapiRuby::Components::Base
      schema(
        type: :object, additionalProperties: false, required: %w[error],
        properties: {
          error: {
            type: :object, additionalProperties: false, required: %w[code message],
            properties: { code: { type: :string, enum: %w[forbidden not_found] }, message: { type: :string, minLength: 1 } },
          },
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
