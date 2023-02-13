class ProjectSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :display_name,
    :more_text,
    :shortname,
    :title,
    :num_interviews,
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
    :archive_id_number_length,
    :identifier,
    :is_catalog,
    :domain,
    :archive_domain,
    :doi,
    :cooperation_partner,
    :leader,
    :manager,
    :funder_names,
    :pseudo_funder_names,
    :contact_email,
    :smtp_server,
    :has_newsletter,
    :logged_out_visible_registry_entry_ids,
    :pseudo_logged_out_visible_registry_entry_ids,
    :hidden_registry_entry_ids,
    :pseudo_hidden_registry_entry_ids,
    :pdf_registry_entry_ids,
    :pseudo_pdf_registry_entry_ids,
    :hidden_transcript_registry_entry_ids,
    :pseudo_hidden_transcript_registry_entry_ids,
    :people,
    :collections,
    :collection_ids,
    :registry_name_types,
    :registry_reference_types,
    :task_types,
    :contribution_types,
    :metadata_fields,
    :external_links,
    :media_streams,
    :map_sections,
    :institution_projects,
    :logos,
    :sponsor_logos,
    :list_columns,
    :grid_fields,
    :root_registry_entry_id,
    :display_ohd_link,
    :show_preview_img,
    :default_search_order,
    :workflow_state,
    :is_ohd

  def title
    object.shortname
  end

  def archive_domain
    object.archive_domain.blank? ? nil : object.archive_domain
  end

  # light-weight data.
  # can be loaded with the project for now.
  %w(
    registry_name_types
    registry_reference_types
    contribution_types
    metadata_fields
    external_links
    media_streams
    map_sections
    institution_projects
  ).each do |m|
    define_method m do
      object.send(m).inject({}) { |mem, c| mem[c.id] = "#{m.singularize.classify}Serializer".constantize.new(c); mem }
    end
  end

  # more load-intense data.
  # should be loaded only where needed.
  %w(
    people
    collections
    task_types
    roles
  ).each do |m|
    define_method m do
      {}
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

  def display_name
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.display_name(locale)
      mem
    end
  end

  def has_map
    object.has_map ? 1 : 0
  end

  def root_registry_entry_id
    object.root_registry_entry.id
  end

  def is_ohd
    object.shortname == 'ohd'
  end
end
