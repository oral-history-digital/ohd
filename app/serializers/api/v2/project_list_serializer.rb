module Api
  module V2
    class ProjectListSerializer < ActiveModel::Serializer
      include LocalizedHashValue

      attributes :id, :shortname, :is_umbrella,
        :name, :display_name, :display_shortname, :archive_domain,
        :workflow_state, :publication_date, :available_locales, :default_locale,
        :introduction, :logo, :favicon_url,
        :grant_access_without_login, :grant_project_access_instantly

      %i[name display_name introduction].each do |attribute|
        define_method(attribute) { localized_project_value(attribute) }
      end

      def is_umbrella
        object.id == instance_options.fetch(:umbrella_project_id)
      end

      def archive_domain
        object.archive_domain.presence
      end

      def grant_access_without_login
        object.grant_access_without_login?
      end

      def grant_project_access_instantly
        object.grant_project_access_instantly?
      end

      def logo
        logos = object.logos.sort_by(&:id)
        selected = logos.find { |item| item.locale.to_s == I18n.locale.to_s } ||
          logos.find { |item| item.locale.to_s == object.default_locale.to_s } || logos.first
        return unless selected&.file&.attached?

        { id: selected.id, url: Rails.application.routes.url_helpers.rails_blob_path(selected.file, only_path: true) }
      end

      def favicon_url
        return unless object.favicon.attached?

        Rails.application.routes.url_helpers.rails_blob_path(object.favicon, only_path: true)
      end

      private

      def localized_project_value(attribute)
        # Read translation values directly so Globalize's global fallback order
        # cannot take precedence over this project's default language.
        values = object.translations.sort_by(&:id).to_h { |translation| [translation.locale, translation[attribute].presence] }
        localized_hash_value(values, default_locale: object.default_locale || I18n.default_locale)
      end
    end
  end
end
