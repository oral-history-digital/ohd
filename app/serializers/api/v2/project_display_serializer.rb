module Api
  module V2
    # Display details extend the summary contract and share its optional includes.
    class ProjectDisplaySerializer < ProjectListSerializer
      ACCESS_CONFIG_FIELDS = {
        organization: nil,
        job_description: %w[researcher filmmaker journalist teacher memorial_staff pupil student other],
        research_intentions: %w[exhibition education film memorial_culture_project genealogy art personal_interest
          press_publishing school_project university_teaching scientific_paper other],
        specification: nil,
        tos_agreement: nil,
      }.freeze

      METADATA_FIELD_ATTRIBUTES = %w[id name source ref_object_type registry_reference_type_id
        event_type_id eventable_type facet_order list_columns_order map_color].freeze
      METADATA_FIELD_FLAGS = %w[use_as_facet use_in_results_table use_in_results_list use_in_map_search
        use_in_details_view display_on_landing_page].freeze

      attributes :domain, :more_text, :primary_color, :secondary_color, :editorial_color,
        :has_map, :is_catalog, :has_newsletter, :display_ohd_link, :show_preview_img, :oai_doi_identifier,
        :view_modes, :default_search_order, :aspect_x, :aspect_y

      attribute :media_types, if: :include_media_types?
      attribute :interview_year_range, if: :include_year_ranges?
      attribute :birth_year_range, if: :include_year_ranges?
      attribute :subjects, if: :include_subjects?
      attribute :levels_of_indexing, if: :include_levels_of_indexing?
      attribute :access_config, if: :include_access_config?
      attribute :metadata_fields, if: :include_metadata_fields?
      attribute :root_registry_entry_id, if: :include_registry_configuration?
      attribute :logged_out_visible_registry_entry_ids, if: :include_registry_configuration?
      attribute :hidden_registry_entry_ids, if: :include_registry_configuration?
      attribute :media_streams, if: :include_playback?
      attribute :media_missing_text, if: :include_playback?

      # Boolean checks for requested includes; the controller has already parsed their names into an array.
      %w[media_types year_ranges subjects levels_of_indexing affiliates access_config metadata_fields registry_configuration playback].each do |name|
        define_method("include_#{name}?") { instance_options.fetch(:requested_includes, []).include?(name) }
      end

      # include=affiliates adds cooperation_partners, leaders, managers, and funders with localized names.
      %w[cooperation_partners leaders managers funders].each do |name|
        attribute name.to_sym, if: :include_affiliates?
        define_method(name) do
          type = name.classify
          object.affiliates.select { |affiliate| affiliate.type == type }.sort_by(&:id).map do |affiliate|
            first_name = localized_value(affiliate, :first_name)
            last_name = localized_value(affiliate, :last_name)
            display_name = if affiliate.name_type == 'Personal'
              [first_name, last_name].compact.map(&:strip).reject(&:blank?).join(' ').presence
            else
              localized_value(affiliate, :name)
            end
            { id: affiliate.id, type: affiliate.type, name_type: affiliate.name_type,
              name: display_name, first_name: first_name, last_name: last_name }
          end
        end
      end

      # Read precomputed audio/video counts for this project; missing data means zero counts.
      def media_types
        instance_options.fetch(:media_types).fetch(object.id, { audio: 0, video: 0 })
      end

      # One year_ranges include adds two precomputed min/max objects; missing data uses null bounds.
      %w[interview birth].each do |name|
        define_method("#{name}_year_range") do
          instance_options.fetch("#{name}_year_ranges".to_sym).fetch(object.id, { min: nil, max: nil })
        end
      end

      def subjects
        registry_entries(object.umbrella_subjects_registry_entry_ids).filter_map { |entry| registry_descriptor(entry) }
      end

      def levels_of_indexing
        counts = object.umbrella_level_of_indexing_registry_entry_groups.to_h
        registry_entries(counts.keys).map do |entry|
          { descriptor: registry_descriptor(entry), count: counts.fetch(entry.id) }
        end
      end

      # Returns registration field settings without user answers or editor identifiers.
      # Legacy boolean strings are interpreted as in the existing registration form.
      #
      # @return [Hash, nil] Allowlisted boolean settings, or nil if no configuration exists
      def access_config
        config = object.access_config
        return unless config

        ACCESS_CONFIG_FIELDS.to_h do |field, options|
          settings = (config.public_send(field) || {}).with_indifferent_access
          result = %i[display obligatory].to_h { |flag| [flag, settings[flag].to_s.downcase == 'true'] }
          if options
            values = (settings[:values] || {}).with_indifferent_access
            result[:values] = options.to_h { |option| [option, values[option].to_s.downcase == 'true'] }
          end
          [field, result]
        end
      end

      # Returns field definitions in ID order; clients derive grid/list selections
      # from use_in_results_table/use_in_results_list and list_columns_order.
      #
      # @return [Array<Hash>] Localized metadata definitions without registry trees
      def metadata_fields
        instance_options.fetch(:metadata_fields).fetch(object.id, []).map do |field|
          field.attributes.slice(*METADATA_FIELD_ATTRIBUTES).merge(
            METADATA_FIELD_FLAGS.to_h { |flag| [flag, field.public_send("#{flag}?")] }
          ).merge('label' => localized_value(field, :label),
            'registry_entry_id' => field.registry_reference_type&.registry_entry_id)
        end
      end

      # Resolves only this project's root; configuration does not grant registry access.
      #
      # @return [Integer, nil] Root entry ID, or nil when none is configured
      def root_registry_entry_id
        object.root_registry_entry&.id
      end

      # Describes sources for the authorized media route without exposing path templates.
      #
      # @return [Array<Hash>] Stream descriptors in ID order, including still-image streams
      def media_streams
        instance_options.fetch(:media_streams).fetch(object.id, []).map do |stream|
          { id: stream.id, media_type: stream.media_type, resolution: stream.resolution,
            suffix: File.extname(stream.path.to_s.split(/[?#]/, 2).first.to_s).delete_prefix('.').presence }
        end
      end

      # Uses the same locale fallback as other project display text.
      #
      # @return [String, nil] Custom missing-media message; nil lets clients use the standard message
      def media_missing_text
        localized_value(object, :media_missing_text)
      end

      def more_text
        localized_value(object, :more_text)
      end

      %i[has_map is_catalog has_newsletter display_ohd_link show_preview_img].each do |attribute|
        define_method(attribute) { object.public_send("#{attribute}?") }
      end

      def oai_doi_identifier
        object.oai_doi_identifier if object.doi_status == 'created'
      end

      private

      def registry_entries(ids)
        RegistryEntry.where(project: Project.umbrella, id: ids).order(:id).includes(registry_names: [:translations, :registry_name_type])
      end

      # Read stored name translations so the project fallback precedes Globalize's defaults.
      def registry_descriptor(entry)
        names = entry.registry_names.sort_by { |name| [name.registry_name_type&.order_priority || 0, name.name_position || 0, name.id] }
        names.group_by(&:registry_name_type_id).values.filter_map do |group|
          group.filter_map { |name| localized_value(name, :descriptor) }.join(' ').presence
        end.join(', ').presence
      end
    end
  end
end
