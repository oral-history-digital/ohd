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

    class YearRange
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[min max],
        properties: { min: { type: %w[integer null] }, max: { type: %w[integer null] } })
    end

    class ProjectAffiliate
      include OpenapiRuby::Components::Base
      schema(
        type: :object, additionalProperties: false, required: %w[id type name_type name first_name last_name],
        properties: {
          id: { type: :integer, minimum: 1 },
          type: { type: :string, enum: %w[CooperationPartner Leader Manager Funder] },
          name_type: { type: %w[string null] },
          name: { type: %w[string null], description: 'Display name; personal names combine first_name and last_name' },
          first_name: { type: %w[string null] }, last_name: { type: %w[string null] },
        },
      )
    end

    # Stored names preserve translation IDs and empty values for existing affiliate mutations.
    class ProjectAffiliateTranslation
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id locale name first_name last_name],
        properties: {
          id: { type: :integer, minimum: 1 }, locale: { type: :string },
          **%i[name first_name last_name].to_h { |field| [field, { type: %w[string null] }] },
        })
    end

    # Editable affiliates extend the display shape rather than changing localized field types.
    class ProjectEditableAffiliate < ProjectAffiliate
      schema(required: %w[translations], properties: {
        translations: { type: :array, items: ProjectAffiliateTranslation },
      })
    end

    # Registration form configuration shared by public display and editing.
    class ProjectAccessConfig
      include OpenapiRuby::Components::Base

      fields = {
        organization: nil,
        job_description: %w[researcher filmmaker journalist teacher memorial_staff pupil student other],
        research_intentions: %w[exhibition education film memorial_culture_project genealogy art personal_interest
          press_publishing school_project university_teaching scientific_paper other],
        specification: nil, tos_agreement: nil,
      }
      properties = fields.to_h do |field, options|
        flags = { display: { type: :boolean }, obligatory: { type: :boolean } }
        if options
          flags[:values] = { type: :object, additionalProperties: false, required: options,
            properties: options.to_h { |option| [option, { type: :boolean }] } }
        end
        [field, { type: :object, additionalProperties: false, required: flags.keys.map(&:to_s), properties: flags }]
      end
      schema(type: %w[object null], additionalProperties: false, required: fields.keys.map(&:to_s), properties: properties)
    end

    # Editable configuration adds its save identifier to the shared field settings.
    class ProjectEditableAccessConfig < ProjectAccessConfig
      schema(required: %w[id], properties: { id: { type: :integer, minimum: 1 } })
    end

    # Read-safe field definitions; registry references contain IDs rather than trees.
    class ProjectMetadataField
      include OpenapiRuby::Components::Base
      properties = {
        id: { type: :integer, minimum: 1 },
        name: { type: :string },
        source: { type: :string, enum: %w[Person Interview RegistryReferenceType EventType] },
        label: { type: %w[string null] },
        **%i[ref_object_type eventable_type map_color].to_h { |key| [key, { type: %w[string null] }] },
        **%i[registry_reference_type_id registry_entry_id event_type_id].to_h { |key| [key, { type: %w[integer null] }] },
        **%i[facet_order list_columns_order].to_h { |key| [key, { type: %w[number null] }] },
        **%i[use_as_facet use_in_results_table use_in_results_list use_in_map_search
          use_in_details_view display_on_landing_page].to_h { |key| [key, { type: :boolean }] },
      }
      schema(type: :object, additionalProperties: false, required: properties.keys.map(&:to_s), properties: properties)
    end

    # Stored labels preserve blank values and IDs for metadata-field mutations.
    class MetadataFieldTranslation
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id locale label],
        properties: { id: { type: :integer, minimum: 1 }, locale: { type: :string }, label: { type: %w[string null] } })
    end

    # Import configuration and stored translations require project update permission.
    class ProjectEditableMetadataField < ProjectMetadataField
      schema(required: %w[use_in_metadata_import translations], properties: {
        use_in_metadata_import: { type: :boolean },
        translations: { type: :array, items: MetadataFieldTranslation },
      })
    end

    # Playback descriptors contain no storage paths or media authorization tokens.
    class ProjectMediaStream
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id media_type resolution suffix],
        properties: {
          id: { type: :integer, minimum: 1 },
          media_type: { type: %w[string null] },
          resolution: { type: %w[string null] },
          suffix: { type: %w[string null], description: 'File extension without a dot or query string; null if absent' },
        })
    end

    # Full path templates additionally require stream-update permission.
    class ProjectEditableMediaStream < ProjectMediaStream
      schema(required: %w[path], properties: { path: { type: %w[string null] } })
    end

    # Public footer links contain localized display text and targets only.
    class ProjectExternalLink
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id name url], properties: {
        id: { type: :integer, minimum: 1 }, name: { type: %w[string null] }, url: { type: %w[string null] },
      })
    end

    # Stored link translations preserve mutation IDs and values without locale fallback.
    class ProjectExternalLinkTranslation
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id locale name url], properties: {
        id: { type: :integer, minimum: 1 }, locale: { type: :string },
        name: { type: %w[string null] }, url: { type: %w[string null] },
      })
    end

    # Complete links extend the footer projection with explicit editing fields.
    class ProjectEditableExternalLink < ProjectExternalLink
      schema(required: %w[internal_name translations], properties: {
        internal_name: { type: %w[string null] },
        translations: { type: :array, items: ProjectExternalLinkTranslation },
      })
    end

    # Footer-only edit reads retain the display contract.
    class ProjectEditExternalLink
      include OpenapiRuby::Components::Base
      schema(anyOf: [ProjectExternalLink, ProjectEditableExternalLink])
    end

    # Footer images are restricted to the requested locale and attached files.
    class ProjectSponsorLogo
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id locale href title url], properties: {
        id: { type: :integer, minimum: 1 }, locale: { type: :string },
        href: { type: %w[string null] }, title: { type: %w[string null] },
        url: { type: :string, description: 'Relative attachment URL' },
      })
    end

    # Complete image records for administration; missing files do not hide editable records.
    class ProjectEditableImage
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id type locale href title url filename], properties: {
        id: { type: :integer, minimum: 1 }, type: { type: :string, enum: %w[Logo SponsorLogo] },
        **%i[locale href title url filename].to_h { |field| [field, { type: %w[string null] }] },
      })
    end

    # Edit footer reads use the display shape; branding reads use complete image records.
    class ProjectEditSponsorLogo
      include OpenapiRuby::Components::Base
      schema(anyOf: [ProjectSponsorLogo, ProjectEditableImage])
    end

    # Optional page content uses the same locale fallback as project display fields.
    class ProjectText
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id code text], properties: {
        id: { type: :integer, minimum: 1 }, code: { type: :string },
        text: { type: %w[string null], description: 'Localized rich text; sanitize before rendering HTML' },
      })
    end

    # Stored page translations preserve IDs, blanks, and nulls for existing mutation routes.
    class ProjectTextTranslation
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id locale text], properties: {
        id: { type: :integer, minimum: 1 }, locale: { type: :string }, text: { type: %w[string null] },
      })
    end

    # Page editing requires the project's update permission, matching existing text mutations.
    class ProjectEditableText < ProjectText
      schema(required: %w[translations], properties: {
        translations: { type: :array, items: ProjectTextTranslation },
      })
    end

    class ProjectDisplay < ProjectSummary
      schema(
        description: 'Localized public display details, including the fields used by ProjectHome. Institutions remain an optional include.',
        required: %w[domain more_text primary_color secondary_color editorial_color has_map is_catalog has_newsletter display_ohd_link show_preview_img oai_doi_identifier view_modes default_search_order aspect_x aspect_y],
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
          show_preview_img: { type: :boolean, description: 'Show interview preview images even without project access' },
          oai_doi_identifier: { type: %w[string null], description: 'DOI URL only when doi_status is created; otherwise null' },
          view_modes: { type: :array, items: { type: :string } },
          default_search_order: { type: %w[string null], enum: %w[title random archive_id] + [nil] },
          aspect_x: { type: %w[integer null] },
          aspect_y: { type: %w[integer null] },
          access_config: ProjectAccessConfig,
          metadata_fields: { type: :array, items: ProjectMetadataField },
          media_streams: { type: :array, items: ProjectMediaStream },
          external_links: { type: :array, items: ProjectExternalLink },
          texts: { type: :array, items: ProjectText },
          sponsor_logos: { type: :array, items: ProjectSponsorLogo },
          media_missing_text: { type: %w[string null], description: 'Localized custom rich text; sanitize before rendering. Null means use the standard UI message.' },
          root_registry_entry_id: { type: %w[integer null], description: 'Target project root entry, or null when absent' },
          **%i[logged_out_visible_registry_entry_ids hidden_registry_entry_ids]
            .to_h { |field| [field, { type: :array, items: { type: :string } }] },
          media_types: {
            type: :object, additionalProperties: false, required: %w[audio video],
            properties: { audio: { type: :integer, minimum: 0 }, video: { type: :integer, minimum: 0 } },
          },
          interview_year_range: YearRange,
          birth_year_range: YearRange,
          subjects: { type: :array, items: { type: :string } },
          levels_of_indexing: {
            type: :array, items: {
              type: :object, additionalProperties: false, required: %w[descriptor count],
              properties: { descriptor: { type: %w[string null] }, count: { type: :integer, minimum: 0 } },
            },
          },
          **%i[cooperation_partners leaders managers funders].to_h { |field| [field, { type: :array, items: ProjectAffiliate }] },
        },
      )
    end

    class ProjectTranslation
      include OpenapiRuby::Components::Base
      schema(
        type: :object, additionalProperties: false,
        description: 'Stored translation values without fallback or HTML sanitization; sanitize rich text before rendering.',
        required: %w[id locale name display_name introduction more_text landing_page_text restricted_landing_page_text media_missing_text],
        properties: {
          id: { type: :integer, minimum: 1 },
          locale: { type: :string },
          **%i[name display_name introduction more_text landing_page_text restricted_landing_page_text media_missing_text]
            .to_h { |field| [field, { type: %w[string null] }] },
        },
      )
    end

    # Editable assignment fields; institution details retain their own read contract.
    class ProjectInstitutionAssignment
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[id institution_id primary], properties: {
        id: { type: :integer, minimum: 1 }, institution_id: { type: %w[integer null] },
        primary: { type: :boolean, description: 'Unset legacy values mean false' },
      })
    end

    class ProjectEdit < ProjectDisplay
      schema(
        description: 'Project settings requiring update permission. Display fields retain their types; stored translations are an optional edit-only include.',
        required: %w[contact_email archive_id_number_length fullname_on_landing_page show_legend
          upload_types logged_out_visible_registry_entry_ids hidden_registry_entry_ids hidden_transcript_registry_entry_ids pdf_registry_entry_ids],
        properties: {
          contact_email: { type: %w[string null] },
          archive_id_number_length: { type: %w[integer null] },
          fullname_on_landing_page: { type: :boolean },
          show_legend: { type: :boolean },
          **%i[upload_types logged_out_visible_registry_entry_ids hidden_registry_entry_ids hidden_transcript_registry_entry_ids pdf_registry_entry_ids]
            .to_h { |field| [field, { type: :array, items: { type: :string } }] },
          translations: { type: :array, items: ProjectTranslation },
          access_config: ProjectEditableAccessConfig,
          metadata_fields: { type: :array, items: ProjectEditableMetadataField },
          media_streams: { type: :array, items: ProjectEditableMediaStream },
          external_links: { type: :array, items: ProjectEditExternalLink },
          texts: { type: :array, items: ProjectEditableText },
          institution_projects: { type: :array, items: ProjectInstitutionAssignment },
          logos: { type: :array, items: ProjectEditableImage },
          **%i[cooperation_partners leaders managers funders].to_h { |field| [field, { type: :array, items: ProjectEditableAffiliate }] },
          sponsor_logos: { type: :array, items: ProjectEditSponsorLogo },
        },
      )
    end

    class ProjectDetailResponse
      include OpenapiRuby::Components::Base
      schema(type: :object, additionalProperties: false, required: %w[data],
        properties: { data: { oneOf: [ProjectDisplay, ProjectEdit] } })
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
