module Api
  module V2
    class ProjectDisplayCache < ProjectReadCache
      ENDPOINT = 'projects/show'
      REVISION = 12

      private

      def dependencies
        result = super.merge(
          display_fields: fingerprint(@projects, :domain, :primary_color, :secondary_color,
            :editorial_color, :has_map, :is_catalog, :has_newsletter, :display_ohd_link, :show_preview_img, :doi_status,
            :view_modes, :default_search_order, :aspect_x, :aspect_y),
          more_text: fingerprint(Project.translation_class.where(project_id: @project_ids), :project_id, :locale, :more_text),
          doi_prefix: Rails.configuration.datacite['prefix']
        )
        if @includes.include?('access_config')
          result[:access_config] = fingerprint(AccessConfig.where(project_id: @project_ids),
            :project_id, :organization, :job_description, :research_intentions, :specification, :tos_agreement)
        end
        if @includes.include?('metadata_fields')
          fields = MetadataField.where(project_id: @project_ids)
          result[:metadata_fields] = fingerprint(fields, :project_id, :name, :source, :ref_object_type,
            :registry_reference_type_id, :event_type_id, :eventable_type, :facet_order, :list_columns_order,
            :map_color, :use_as_facet, :use_in_results_table, :use_in_results_list, :use_in_map_search,
            :use_in_details_view, :display_on_landing_page)
          result[:metadata_labels] = fingerprint(MetadataField.translation_class.where(metadata_field_id: fields.select(:id)),
            :metadata_field_id, :locale, :label)
          result[:metadata_reference_types] = fingerprint(RegistryReferenceType.where(id: fields.select(:registry_reference_type_id)),
            :registry_entry_id)
        end
        if @includes.include?('registry_configuration')
          result[:registry_visibility] = fingerprint(@projects, :logged_out_visible_registry_entry_ids, :hidden_registry_entry_ids)
          result[:registry_roots] = fingerprint(RegistryEntry.where(project_id: @project_ids, code: 'root'), :project_id, :code)
        end
        if @includes.include?('playback')
          result[:media_streams] = fingerprint(MediaStream.where(project_id: @project_ids), :project_id, :media_type, :resolution, :path)
          result[:media_missing_text] = fingerprint(Project.translation_class.where(project_id: @project_ids), :project_id, :locale, :media_missing_text)
        end
        add_external_links(result) if (@includes & %w[footer external_links]).any?
        if @includes.include?('texts')
          texts = Text.where(project_id: @project_ids)
          result[:texts] = fingerprint(texts, :project_id, :code)
          result[:text_translations] = fingerprint(Text.translation_class.where(text_id: texts.select(:id)), :text_id, :locale, :text)
        end
        if @includes.include?('map_sections')
          sections = MapSection.where(project_id: @project_ids)
          result[:map_sections] = fingerprint(sections, :project_id, :name, :order, :corner1_lat, :corner1_lon, :corner2_lat, :corner2_lon)
          result[:map_section_labels] = fingerprint(MapSection.translation_class.where(map_section_id: sections.select(:id)), :map_section_id, :locale, :label)
        end
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

      # Tracks display and editable links once, including their stored translations.
      #
      # @param result [Hash] Response dependencies to extend
      # @return [void]
      def add_external_links(result)
        links = ExternalLink.where(project_id: @project_ids)
        columns = [:project_id]
        columns << :internal_name if @includes.include?('external_links')
        result[:external_links] = fingerprint(links, *columns)
        result[:external_link_translations] = fingerprint(ExternalLink.translation_class.where(external_link_id: links.select(:id)),
          :external_link_id, :locale, :name, :url)
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
