class ProjectBaseSerializer < ActiveModel::Serializer 
  attributes :id,
    :type,
    :name,
    :display_name,
    :shortname,
    :archive_domain,
    :available_locales,
    :view_modes,
    :collection_ids,
    :registry_reference_type_ids,
    :root_registry_entry_id,
    :is_ohd

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

end
