class ProjectSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :more_text,
    :shortname,
    :title,
    :available_locales,
    :pseudo_available_locales,
    :default_locale,
    :view_modes,
    :pseudo_view_modes,
    :upload_types,
    :pseudo_upload_types,
    :fullname_on_landing_page,
    :primary_color,
    :secondary_color,
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
    :pseudo_funder_names,
    :contact_email,
    :smtp_server,
    :has_newsletter,
    :hidden_registry_entry_ids,
    :pseudo_hidden_registry_entry_ids,
    :pdf_registry_entry_codes,
    :pseudo_pdf_registry_entry_codes,
    :metadata_fields,
    :external_links,
    :logos,
    :sponsor_logos,
    :list_columns

  def title
    object.shortname
  end

  def metadata_fields
    object.metadata_fields.inject({}) { |mem, c| mem[c.id] = MetadataFieldSerializer.new(c); mem }
  end

  def external_links
    object.external_links.inject({}) { |mem, c| mem[c.id] = ExternalLinkSerializer.new(c); mem }
  end

  def logos
    object.logos.inject({}) { |mem, c| mem[c.id] = UploadedFileSerializer.new(c); mem }
  end

  def sponsor_logos
    object.sponsor_logos.inject({}) { |mem, c| mem[c.id] = UploadedFileSerializer.new(c); mem }
  end

  def name
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.name(locale)
      mem
    end
  end
  
end
