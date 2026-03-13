class ProjectArchiveSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :display_name,
    :shortname,
    :archive_domain,
    :latitude,
    :longitude,
    :introduction,
    :more_text,
    :institutions,
    :interviews,
    :collections,
    :logo,
    :workflow_state,
    :available_locales,
    :has_map,
    :is_catalog,
    :has_newsletter,
    :publication_date

  def name
    object.name
  end

  def display_name
    object.display_name
  end

  def archive_domain
    object.archive_domain.presence
  end

  def introduction
    object.introduction
  end

  def more_text
    object.more_text
  end

  def institutions
    object.institutions.map do |institution|
      {
        id: institution.id,
        name: institution.name
      }
    end
  end

  def interviews
    states = %w(public restricted unshared)
    counts = counts_for(instance_options[:interview_counts], states)

    {
      public: counts['public'],
      restricted: counts['restricted'],
      unshared: counts['unshared'],
      total: states.sum { |state| counts[state] }
    }
  end

  def collections
    states = %w(public restricted)
    counts = counts_for(instance_options[:collection_counts], states)

    {
      public: counts['public'],
      restricted: counts['restricted'],
      total: states.sum { |state| counts[state] }
    }
  end

  def logo
    localized_logo = object.logos.find { |item| item.locale.to_s == I18n.locale.to_s } || object.logos.first
    return nil unless localized_logo&.file&.attachment

    {
      id: localized_logo.id,
      url: Rails.application.routes.url_helpers.rails_blob_path(localized_logo.file, only_path: true)
    }
  end

  def latitude
    institution_with_coordinates&.latitude
  end

  def longitude
    institution_with_coordinates&.longitude
  end

  private

  def counts_for(source, states)
    source ||= {}

    states.each_with_object({}) do |state, result|
      result[state] = source.fetch([object.id, state], 0)
    end
  end

  def institution_with_coordinates
    @institution_with_coordinates ||= object.institutions.find do |institution|
      institution.latitude.present? && institution.longitude.present?
    end
  end
end
