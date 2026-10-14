module Api
  module V2
    class ProjectEditCache < ProjectDisplayCache
      ENDPOINT = 'projects/edit'
      REVISION = 1

      private

      def dependencies
        result = super.merge(
          edit_fields: fingerprint(@projects, :contact_email, :aspect_x, :aspect_y, :archive_id_number_length,
            :fullname_on_landing_page, :show_preview_img, :show_legend, :view_modes, :upload_types,
            :logged_out_visible_registry_entry_ids, :hidden_registry_entry_ids,
            :hidden_transcript_registry_entry_ids, :pdf_registry_entry_ids)
        )
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
