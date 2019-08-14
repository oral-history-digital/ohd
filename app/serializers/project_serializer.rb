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
    :external_links

  def title
    object.shortname
  end

  def metadata_fields
    object.metadata_fields.inject({}){|mem, c| mem[c.id] = MetadataFieldSerializer.new(c); mem}
  end

  def external_links
    object.external_links.inject({}){|mem, c| mem[c.id] = ExternalLinkSerializer.new(c); mem}
  end

end
