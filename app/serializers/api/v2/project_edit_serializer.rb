module Api
  module V2
    # Keep localized display fields unchanged; complete translations are optional.
    class ProjectEditSerializer < ProjectDisplaySerializer
      attributes :contact_email, :archive_id_number_length,
        :fullname_on_landing_page, :show_legend,
        :upload_types, :logged_out_visible_registry_entry_ids,
        :hidden_registry_entry_ids, :hidden_transcript_registry_entry_ids, :pdf_registry_entry_ids

      attribute :translations, if: :include_translations?

      # Adds the configuration ID needed by the existing access-settings save endpoint.
      #
      # @return [Hash, nil] Editable registration settings, or nil if no configuration exists
      def access_config
        settings = super
        settings&.merge(id: object.access_config.id)
      end

      %i[fullname_on_landing_page show_legend].each do |attribute|
        define_method(attribute) { object.public_send("#{attribute}?") }
      end

      def include_translations?
        instance_options.fetch(:requested_includes, []).include?('translations')
      end

      def translations
        # Preserve IDs for existing save endpoints and stored blanks without fallback.
        object.translations.sort_by(&:id).map do |translation|
          translation.attributes.slice('id', 'locale', 'name', 'display_name', 'introduction',
            'more_text', 'landing_page_text', 'restricted_landing_page_text', 'media_missing_text')
        end
      end
    end
  end
end
