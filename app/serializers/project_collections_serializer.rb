class ProjectCollectionsSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :shortname,
    :project_id,
    :homepage,
    :notes,
    :institution,
    :interviews,
    :countries,
    :interviewers,
    :responsibles,
    :publication_date,
    :workflow_state,
    :languages_interviews

  def institution
    return nil unless object.institution

    {
      id: object.institution.id,
      name: object.institution.name
    }
  end

  def interviews
    states = %w(public restricted unshared)
    counts = states.each_with_object({}) do |state, result|
      result[state] = instance_options[:interview_counts].fetch([object.id, state], 0)
    end

    {
      public: counts['public'],
      restricted: counts['restricted'],
      unshared: counts['unshared'],
      total: states.sum { |state| counts[state] }
    }
  end

  def countries
    array_value(object.countries)
  end

  def interviewers
    array_value(object.interviewers)
  end

  def responsibles
    array_value(object.responsibles)
  end

  def languages_interviews
    source = instance_options[:interview_languages_by_collection] || {}
    source.fetch(object.id, [])
  end

  private

  def array_value(value)
    return value if value.is_a?(Array)
    return [] if value.blank?

    [value]
  end
end
