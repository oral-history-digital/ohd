class ProjectSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :shortname,
    :title,
    :available_locales,
    :default_locale,
    :view_modes,
    :upload_types,
    :primary_color_rgb,
    :initials,
    :identifier,
    :is_catalog,
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
    :detail_view_fields,
    :list_columns,
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
  
  def detail_view_fields
    #object.detail_view_fields.inject({}) { |mem, field| mem[field.name] = MetadataFieldSerializer.new(MetadataField.find_by_name(field.name)).as_json; mem }
    object.detail_view_fields.map{|field| field['label'] = field.localized_hash(:label); field}
  end

end
