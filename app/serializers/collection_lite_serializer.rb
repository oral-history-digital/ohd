class CollectionLiteSerializer < ActiveModel::Serializer
  attributes :id,
    :project_id,
    :project_name,
    :name,
    :shortname,
    :publication_date,
    :homepage,
    :notes,
    :responsibles,
    :is_linkable,
    :interviews,
    :num_interviews,
    :media_types,
    :interview_year_range,
    :birth_year_range,
    :languages_interviews,
    :subjects,
    :levels_of_indexing

  def project_id
    object.project_id
  end

  def project_name
    object.project&.name
  end

  def shortname
    object.shortname
  end


  def publication_date
    object.publication_date || object.project&.publication_date
  end

  def is_linkable
    object.linkable?
  end

  def interviews
    instance_options[:interviews] || {
      public: 0,
      restricted: 0,
      unshared: 0,
      total: 0
    }
  end

  def num_interviews
    interviews[:total]
  end

  def name
    localized_value(:name)
  end

  def homepage
    localized_value(:homepage)
  end

  def notes
    localized_value(:notes)
  end

  def responsibles
    localized_value(:responsibles)
  end

  def institution
    object.institution&.name
  end

  def media_types
    instance_options[:media_types] || { audio: 0, video: 0 }
  end

  def interview_year_range
    instance_options[:interview_year_range] || { min: nil, max: nil }
  end

  def birth_year_range
    instance_options[:birth_year_range] || { min: nil, max: nil }
  end

  def languages_interviews
    instance_options[:languages_interviews] || []
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

  private

  def localized_value(attribute_name)
    localized = object.localized_hash(attribute_name)
    return nil unless localized

    localized[I18n.locale.to_s] ||
      localized[I18n.locale.to_sym] ||
      localized.values.compact.first
  end

  def localized_descriptor(value)
    return value unless value.is_a?(Hash)

    value[I18n.locale.to_s] ||
      value[I18n.locale.to_sym] ||
      value.values.compact.first
  end
end