module Api
  module V2
    class ProjectDisplayCache < ProjectReadCache
      ENDPOINT = 'projects/show'
      REVISION = 1

      private

      def dependencies
        super.merge(
          display_fields: fingerprint(@projects, :domain, :primary_color, :secondary_color,
            :editorial_color, :has_map, :is_catalog, :has_newsletter, :display_ohd_link, :doi_status),
          more_text: fingerprint(Project.translation_class.where(project_id: @project_ids), :project_id, :locale, :more_text),
          doi_prefix: Rails.configuration.datacite['prefix']
        )
      end
    end
  end
end
