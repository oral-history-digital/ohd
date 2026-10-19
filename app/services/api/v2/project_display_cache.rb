module Api
  module V2
    class ProjectDisplayCache < ProjectReadCache
      ENDPOINT = 'projects/show'
      REVISION = 2

      private

      def dependencies
        result = super.merge(
          display_fields: fingerprint(@projects, :domain, :primary_color, :secondary_color,
            :editorial_color, :has_map, :is_catalog, :has_newsletter, :display_ohd_link, :doi_status),
          more_text: fingerprint(Project.translation_class.where(project_id: @project_ids), :project_id, :locale, :more_text),
          doi_prefix: Rails.configuration.datacite['prefix']
        )
        interviews = Interview.where(project_id: @project_ids)
        if (@includes & %w[media_types year_ranges]).any?
          result[:catalog_interviews] = fingerprint(interviews, :project_id, :workflow_state, :media_type, :interview_date)
        end
        add_year_ranges(result, interviews) if @includes.include?('year_ranges')
        add_registry(result, interviews) if (@includes & %w[subjects levels_of_indexing]).any?
        if @includes.include?('affiliates')
          affiliates = Affiliate.where(project_id: @project_ids)
          result[:affiliates] = fingerprint(affiliates, :project_id, :type, :name_type)
          result[:affiliate_translations] = fingerprint(Affiliate.translation_class.where(affiliate_id: affiliates.select(:id)),
            :affiliate_id, :locale, :name, :first_name, :last_name)
        end
        result
      end

      def add_year_ranges(result, interviews)
        contributions = Contribution.where(interview_id: interviews.select(:id))
        result[:contributions] = fingerprint(contributions, :interview_id, :person_id, :contribution_type_id)
        result[:contribution_types] = fingerprint(ContributionType.where(id: contributions.select(:contribution_type_id)), :code)
        result[:birth_dates] = fingerprint(Person.where(id: contributions.select(:person_id)), :date_of_birth)
      end

      # Registry labels and hierarchy come from the configured umbrella; references
      # are limited to this project's interviews, as in the existing catalog queries.
      def add_registry(result, interviews)
        entries = RegistryEntry.where(project_id: @parameters.fetch(:umbrella_id))
        result[:registry_entries] = fingerprint(entries, :project_id, :code)
        result[:registry_hierarchy] = fingerprint(RegistryHierarchy.where(ancestor_id: entries.select(:id)), :ancestor_id, :descendant_id)
        names = RegistryName.where(registry_entry_id: entries.select(:id))
        result[:registry_names] = fingerprint(names, :registry_entry_id, :registry_name_type_id, :name_position)
        result[:registry_name_types] = fingerprint(RegistryNameType.where(id: names.select(:registry_name_type_id)), :order_priority)
        result[:registry_name_translations] = fingerprint(RegistryName.translation_class.where(registry_name_id: names.select(:id)),
          :registry_name_id, :locale, :descriptor)
        result[:registry_references] = fingerprint(RegistryReference.where(ref_object_type: 'Interview', ref_object_id: interviews.select(:id)),
          :registry_entry_id, :ref_object_type, :ref_object_id)
      end
    end
  end
end
