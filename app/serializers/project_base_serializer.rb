class ProjectBaseSerializer < ActiveModel::Serializer
  attributes :id,
    :type,
    :name,
    :display_name,
    :shortname,
    :publication_date,
    :archive_domain,
    :available_locales,
    :default_locale,
    :view_modes,
    :list_columns,
    :grid_fields,
    :metadata_fields,
    :collection_ids,
    :registry_reference_type_ids,
    :root_registry_entry_id,
    :workflow_state,
    :num_interviews,
    :institution_ids,
    :logos,
    :is_ohd,
    :show_preview_img,
    :has_map

  def display_name
    object.localized_hash(:display_name)
  end

  def name
    object.localized_hash(:name)
  end

  def archive_domain
    object.archive_domain.blank? ? nil : object.archive_domain
  end

  def is_ohd
    object.shortname == 'ohd'
  end

  def type
    object.class.name
  end

  def root_registry_entry_id
    object.root_registry_entry.id
  end

  def logos
    object.logos.inject({}) { |mem, c| mem[c.id] = UploadedFileSerializer.new(c); mem }
  end

end
