module Api
  module V2
    class ProjectListSerializer < ActiveModel::Serializer
      include LocalizedHashValue

      attributes :id, :shortname, :is_umbrella,
        :name, :display_name, :display_shortname, :archive_domain,
        :workflow_state, :publication_date, :available_locales, :default_locale,
        :introduction, :logo, :favicon_url,
        :grant_access_without_login, :grant_project_access_instantly

      attribute :interview_counts, if: :include_counts?
      attribute :collection_counts, if: :include_counts?
      attribute :institutions, if: :include_institutions?
      attribute :interview_languages, if: :include_interview_languages?
      attribute :collection_preview, if: :include_collection_preview?

      %w[counts institutions interview_languages collection_preview].each do |name|
        define_method("include_#{name}?") { instance_options.fetch(:requested_includes, []).include?(name) }
      end

      %i[name display_name introduction].each do |attribute|
        define_method(attribute) { localized_value(object, attribute) }
      end

      def interview_counts
        counts_for(:interview_counts, %w[public restricted unshared])
      end

      def collection_counts
        counts_for(:collection_counts, %w[public restricted])
      end

      def institutions
        institutions = object.institutions.sort_by(&:id)
        primary_id = object.institution_projects.sort_by(&:id).find(&:primary?)&.institution_id || institutions.first&.id
        institutions.map do |institution|
          {
            id: institution.id,
            name: localized_value(institution, :name),
            parent: institution.parent && { id: institution.parent.id, name: localized_value(institution.parent, :name) },
            is_primary: institution.id == primary_id,
          }
        end
      end

      def interview_languages
        instance_options.fetch(:interview_languages).fetch(object.id, [])
      end

      def collection_preview
        instance_options.fetch(:collections_by_project).fetch(object.id, []).sort_by(&:id).map do |collection|
          { id: collection.id, name: localized_value(collection, :name), notes: localized_value(collection, :notes) }
        end
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

      # Counts retain catalog aggregate rules; they are not lists of readable records.
      def counts_for(source, states)
        counts = states.to_h { |state| [state, instance_options.fetch(source).fetch([object.id, state], 0)] }
        counts.merge('total' => counts.values.sum)
      end

      def localized_value(record, attribute)
        # Read translation values directly so Globalize's global fallback order
        # cannot take precedence over this project's default language.
        values = record.translations.sort_by(&:id).to_h { |translation| [translation.locale, translation[attribute].presence] }
        localized_hash_value(values, default_locale: object.default_locale || I18n.default_locale)
      end
    end
  end
end
