class InstitutionListSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :description,
    :isil,
    :gnd,
    :website,
    :address,
    :latitude,
    :longitude,
    :parent,
    :children,
    :logo,
    :archives,
    :collections,
    :interviews

  def parent
    return { id: nil, name: nil } unless object.parent

    {
      id: object.parent.id,
      name: object.parent.name
    }
  end

  def children
    object.children.map do |child|
      {
        id: child.id,
        name: child.name
      }
    end
  end

  def logo
    localized_logo = localized_logo_for(object.logos)
    return nil unless localized_logo&.file&.attachment

    {
      id: localized_logo.id,
      url: Rails.application.routes.url_helpers.rails_blob_path(localized_logo.file, only_path: true)
    }
  end

  def address
    {
      street: object.street,
      zip: object.zip,
      city: object.city,
      country: object.country
    }
  end

  def archives
    projects_by_institution.fetch(object.id, []).map do |project|
      localized_logo = localized_logo_for(project.logos)
      interviews_count =
        project_count_for(project.id, 'public') +
        project_count_for(project.id, 'restricted') +
        project_count_for(project.id, 'unshared')

      {
        id: project.id,
        name: project.name,
        shortname: project.shortname,
        archive_domain: project.archive_domain,
        logo: localized_logo&.file&.attachment ? {
          id: localized_logo.id,
          url: Rails.application.routes.url_helpers.rails_blob_path(localized_logo.file, only_path: true)
        } : nil,
        interviews_count: interviews_count
      }
    end
  end

  def collections
    public_count = collection_count_for('public')
    restricted_count = collection_count_for('restricted')
    unshared_count = collection_count_for('unshared')

    {
      public: public_count,
      restricted: restricted_count,
      unshared: unshared_count,
      total: public_count + restricted_count + unshared_count
    }
  end

  def interviews
    public_count = count_for('public')
    restricted_count = count_for('restricted')
    unshared_count = count_for('unshared')

    {
      public: public_count,
      restricted: restricted_count,
      unshared: unshared_count,
      total: public_count + restricted_count + unshared_count
    }
  end

  private

  def projects_by_institution
    instance_options[:projects_by_institution] || {}
  end

  def count_for(state)
    source = instance_options[:interview_counts] || {}
    source.fetch([object.id, state], 0)
  end

  def project_count_for(project_id, state)
    source = instance_options[:project_interview_counts] || {}
    source.fetch([project_id, state], 0)
  end

  def collection_count_for(state)
    source = instance_options[:collection_counts] || {}
    source.fetch([object.id, state], 0)
  end

  def localized_logo_for(logos)
    logos.find { |logo| logo.locale.to_s == I18n.locale.to_s } || logos.first
  end
end
