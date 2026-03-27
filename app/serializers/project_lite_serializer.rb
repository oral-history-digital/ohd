class ProjectLiteSerializer < ProjectArchiveSerializer
  attributes :cooperation_partner,
    :leader,
    :manager,
    :domain,
    :pseudo_funder_names,
    :subjects,
    :levels_of_indexing,
    :sponsors,
    :contact_people,
    :media_types,
    :interview_year_range,
    :birth_year_range

  def media_types
    source = instance_options[:media_types_by_project] || {}
    source.fetch(object.id, { audio: 0, video: 0 })
  end

  def subjects
    object.ohd_subject_registry_entries.map do |subject|
      localized_descriptor(subject[:descriptor])
    end
  end

  def levels_of_indexing
    object.ohd_level_of_indexing_registry_entries.map do |level|
      {
        descriptor: localized_descriptor(level[:descriptor]),
        count: level[:count]
      }
    end
  end

  def sponsors
    object.sponsor_logos.map do |logo|
      next unless logo.file&.attachment

      {
        id: logo.id,
        locale: logo.locale,
        url: Rails.application.routes.url_helpers.rails_blob_path(logo.file, only_path: true),
        href: logo.href,
        title: logo.title
      }
    end.compact
  end

  def interview_year_range
    range_for(instance_options[:interview_year_ranges_by_project])
  end

  def contact_people
    {
      cooperation_partner: object.cooperation_partner,
      leader: object.leader,
      manager: object.manager
    }
  end

  def birth_year_range
    range_for(instance_options[:birth_year_ranges_by_project])
  end

  private

  def range_for(source)
    source ||= {}
    source.fetch(object.id, { min: nil, max: nil })
  end

  def localized_descriptor(value)
    return value unless value.is_a?(Hash)

    value[I18n.locale.to_s] ||
      value[I18n.locale.to_sym] ||
      value[object.default_locale.to_s] ||
      value[object.default_locale.to_sym] ||
      value.values.compact.first
  end
end
