class ProjectSerializer < ActiveModel::Serializer
  attributes :id,
    :shortname,
    :title,
    :available_locales,
    :default_locale,
    :view_modes,
    :upload_types,
    :primary_color_rgb,
    :initials,
    :identifier,
    :domain,
    :archive_domain,
    :doi,
    :cooperation_partner,
    :leader,
    :manager,
    :hosting_institution,
    :funder_names,
    :contact_email,
    :smtp_server,
    :has_newsletter,
    :hidden_registry_entry_ids,
    :pdf_registry_entry_codes,
    :metadata_fields,
    :external_links,
    :translations

  def title
    object.shortname
  end

  def metadata_fields
    object.metadata_fields.inject({}) { |mem, c| mem[c.id] = MetadataFieldSerializer.new(c); mem }
  end

  def external_links
    object.external_links.inject({}) { |mem, c| mem[c.id] = ExternalLinkSerializer.new(c); mem }
  end

  def name
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.name(locale)
      mem
    end
  end

  # serialized translations are needed to construct 'translations_attributes' e.g. in MultiLocaleInput
  # containing the id of a translation
  #
  # without the id a translation would not be updated but newly created!!
  #
  def translations
    I18n.available_locales.inject([]) do |mem, locale|
      translation = object.translations.where(locale: locale).first
      mem.push(translation.attributes.reject { |k, v| !(object.translated_attribute_names + [:id, :locale]).include?(k.to_sym) }) if translation
      mem
    end
  end
end
