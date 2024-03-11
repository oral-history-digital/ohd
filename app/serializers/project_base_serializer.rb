class ProjectBaseSerializer < ActiveModel::Serializer 
  attributes :id,
    :name,
    :display_name,
    :shortname,
    :archive_domain,
    :available_locales,
    :view_modes,
    :collection_ids,
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
end
