module Api
  module V2
    # Keep localized display fields unchanged; complete translations are optional.
    class ProjectEditSerializer < ProjectDisplaySerializer
      attributes :contact_email, :doi_status, :archive_id_number_length,
        :fullname_on_landing_page, :show_legend,
        :upload_types, :logged_out_visible_registry_entry_ids,
        :hidden_registry_entry_ids, :hidden_transcript_registry_entry_ids, :pdf_registry_entry_ids

      attribute :translations, if: :include_translations?
      attribute :external_links, if: :include_external_links?
      attribute :institution_projects, if: :include_institution_projects?
      attribute :logos, if: :include_branding?
      attribute :sponsor_logos, if: :include_sponsor_logos?

      # Keep display names unchanged and add stored translations for each affiliate editor.
      #
      # @return [Array<Hash>] Subtype records with translation IDs and values without fallback
      %w[cooperation_partners leaders managers funders].each do |name|
        define_method(name) do
          affiliates = object.affiliates.index_by(&:id)
          super().map do |data|
            translations = stored_translations(affiliates.fetch(data.fetch(:id)), 'name', 'first_name', 'last_name')
            data.merge(translations: translations)
          end
        end
      end

      # Adds the configuration ID needed by the existing access-settings save endpoint.
      #
      # @return [Hash, nil] Editable registration settings, or nil if no configuration exists
      def access_config
        settings = super
        settings&.merge(id: object.access_config.id)
      end

      # Adds import settings and stored labels for existing metadata-field editors.
      #
      # @return [Array<Hash>] Definitions with localized labels and stored translations without fallback
      def metadata_fields
        fields = instance_options.fetch(:metadata_fields).fetch(object.id, []).index_by(&:id)
        super.map do |data|
          field = fields.fetch(data.fetch('id'))
          data.merge('use_in_metadata_import' => field.use_in_metadata_import?,
            'translations' => stored_translations(field, 'label'))
        end
      end

      # Adds path templates after the controller verifies stream-update permission.
      #
      # @return [Array<Hash>] Editable streams with their existing mutation IDs
      def media_streams
        streams = instance_options.fetch(:media_streams).fetch(object.id, []).index_by(&:id)
        super.map { |data| data.merge(path: streams.fetch(data.fetch(:id)).path) }
      end

      # Editable link data takes precedence when requested alongside the footer.
      #
      # @return [Array<Hash>] Localized links with internal names and stored translations for editing
      def external_links
        return super unless include_editable_external_links?

        links = instance_options.fetch(:external_links).fetch(object.id, []).index_by(&:id)
        super.map do |data|
          link = links.fetch(data.fetch(:id))
          data.merge(internal_name: link.internal_name, translations: stored_translations(link, 'name', 'url'))
        end
      end

      # Institution names and choices remain owned by the separate institution reader.
      #
      # @return [Array<Hash>] Editable assignments in ID order, with unset primary flags normalized to false
      def institution_projects
        object.institution_projects.sort_by(&:id).map do |assignment|
          { id: assignment.id, institution_id: assignment.institution_id, primary: assignment.primary? }
        end
      end

      # Uses the logo records and attachments already loaded for the selected display logo.
      #
      # @return [Array<Hash>] Editable logos across all locales, including unattached records
      def logos
        object.logos.sort_by(&:id).map { |logo| editable_image(logo) }
      end

      # Branding takes precedence over the footer's locale-filtered display projection.
      #
      # @return [Array<Hash>] Editable sponsor images for branding, or footer display images
      def sponsor_logos
        return super unless include_branding?

        instance_options.fetch(:sponsor_logos).fetch(object.id, []).map { |logo| editable_image(logo) }
      end

      # Adds stored page translations without changing the localized display value.
      #
      # @return [Array<Hash>] Pages with translation IDs, preserving stored blanks and nulls
      def texts
        pages = object.texts.index_by(&:id)
        super.map do |data|
          translations = stored_translations(pages.fetch(data.fetch(:id)), 'text')
          data.merge(translations: translations)
        end
      end

      # @return [Boolean] Whether complete editable links were requested
      def include_editable_external_links?
        instance_options.fetch(:requested_includes, []).include?('external_links')
      end

      # @return [Boolean] Whether either include needs external links
      def include_external_links?
        include_editable_external_links? || include_footer?
      end

      # @return [Boolean] Whether editable institution assignments were requested
      def include_institution_projects?
        instance_options.fetch(:requested_includes, []).include?('institution_projects')
      end

      # @return [Boolean] Whether complete editable asset lists were requested
      def include_branding?
        instance_options.fetch(:requested_includes, []).include?('branding')
      end

      # @return [Boolean] Whether either include needs sponsor images
      def include_sponsor_logos?
        include_branding? || include_footer?
      end

      %i[fullname_on_landing_page show_legend].each do |attribute|
        define_method(attribute) { object.public_send("#{attribute}?") }
      end

      # @return [Boolean] Whether stored project translations were requested
      def include_translations?
        instance_options.fetch(:requested_includes, []).include?('translations')
      end

      # @return [Array<Hash>] Project translations with mutation IDs and no locale fallback
      def translations
        stored_translations(object, 'name', 'display_name', 'introduction', 'more_text',
          'landing_page_text', 'restricted_landing_page_text', 'media_missing_text')
      end

      private

      # Selects only editable translation fields, preserving stored blanks and nulls.
      #
      # @param record [ActiveRecord::Base] Record with preloaded translations
      # @param fields [Array<String>] Stored attributes to include alongside ID and locale
      # @return [Array<Hash>] Translation attributes in ID order, with string keys
      def stored_translations(record, *fields)
        record.translations.sort_by(&:id).map do |translation|
          translation.attributes.slice('id', 'locale', *fields)
        end
      end

      # Keeps editing fields explicit and retains records whose attachment is missing.
      #
      # @param image [UploadedFile] Project-owned logo or sponsor logo
      # @return [Hash] Editable attributes with nullable attachment URL and filename
      def editable_image(image)
        attached = image.file.attached?
        { id: image.id, type: image.type, locale: image.locale, href: image.href, title: image.title,
          url: attached ? Rails.application.routes.url_helpers.rails_blob_path(image.file, only_path: true) : nil,
          filename: attached ? image.file.filename.to_s : nil }
      end
    end
  end
end
