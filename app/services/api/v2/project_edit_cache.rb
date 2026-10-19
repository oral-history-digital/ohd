module Api
  module V2
    class ProjectEditCache < ProjectDisplayCache
      ENDPOINT = 'projects/edit'
      REVISION = 11

      private

      def dependencies
        result = super.merge(
          edit_fields: fingerprint(@projects, :contact_email, :archive_id_number_length,
            :fullname_on_landing_page, :show_legend, :upload_types,
            :logged_out_visible_registry_entry_ids, :hidden_registry_entry_ids,
            :hidden_transcript_registry_entry_ids, :pdf_registry_entry_ids)
        )
        if @includes.include?('metadata_fields')
          result[:metadata_import_settings] = fingerprint(MetadataField.where(project_id: @project_ids), :use_in_metadata_import)
        end
        if @includes.include?('translations')
          result[:edit_translations] = fingerprint(Project.translation_class.where(project_id: @project_ids),
            :locale, :name, :display_name, :introduction, :more_text, :landing_page_text,
            :restricted_landing_page_text, :media_missing_text)
        end
        result
      end
    end
  end
end
