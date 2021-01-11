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
    :has_map,
    :primary_color,
    :secondary_color,
    :editorial_color,
    :aspect_x,
    :aspect_y,
    :initials,
    :archive_id_number_length,
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
    :pdf_registry_entry_ids,
    :pseudo_pdf_registry_entry_ids,
    :hidden_transcript_registry_entry_ids,
    :pseudo_hidden_transcript_registry_entry_ids,
    :metadata_fields,
    :task_types,
    :external_links,
    :logos,
    :sponsor_logos,
    :list_columns,
    :grid_fields,
    :root_registry_entry_id

  def title
    object.shortname
  end

  %w(metadata_fields task_types external_links).each do |m|
    define_method m do
      object.send(m).inject({}) { |mem, c| mem[c.id] = "#{m.singularize.classify}Serializer".constantize.new(c); mem }
    end
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

  def has_map
    object.has_map ? 1 : 0
  end

  def root_registry_entry_id
    object.root_registry_entry.id
  end

end
