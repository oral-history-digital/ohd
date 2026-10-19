module Api
  module V2
    # Display details extend the summary contract and share its optional includes.
    class ProjectDisplaySerializer < ProjectListSerializer
      attributes :domain, :more_text, :primary_color, :secondary_color, :editorial_color,
        :has_map, :is_catalog, :has_newsletter, :display_ohd_link, :oai_doi_identifier

      attribute :media_types, if: :include_media_types?
      attribute :interview_year_range, if: :include_year_ranges?
      attribute :birth_year_range, if: :include_year_ranges?
      attribute :subjects, if: :include_subjects?
      attribute :levels_of_indexing, if: :include_levels_of_indexing?

      # Boolean checks for requested includes; the controller has already parsed their names into an array.
      %w[media_types year_ranges subjects levels_of_indexing affiliates].each do |name|
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

      def more_text
        localized_value(object, :more_text)
      end

      %i[has_map is_catalog has_newsletter display_ohd_link].each do |attribute|
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
