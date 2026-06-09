class ProjectLiteSerializer < ProjectArchiveSerializer
  include LocalizedHashValue

  attributes :cooperation_partners,
    :leaders,
    :managers,
    :funders,
    :domain,
    :subjects,
    :levels_of_indexing,
    :sponsors,
    :contact_people,
    :media_types,
    :interview_year_range,
    :birth_year_range,
    :primary_institution

  %w(
    cooperation_partners
    leaders
    managers
    funders
  ).each do |m|
    define_method m do
      serialized_affiliates(object.send(m))
    end
  end

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
    cooperation_partners = object.cooperation_partners.map { |a| affiliate_display_name(a) }.reject(&:blank?).join(', ')
    leaders = object.leaders.map { |a| affiliate_display_name(a) }.reject(&:blank?).join(', ')
    managers = object.managers.map { |a| affiliate_display_name(a) }.reject(&:blank?).join(', ')
    funders = object.funders.map { |a| affiliate_display_name(a) }.reject(&:blank?).join(', ')

    {
      cooperation_partners: cooperation_partners,
      leaders: leaders,
      managers: managers,
      funders: funders
    }
  end

  def birth_year_range
    range_for(instance_options[:birth_year_ranges_by_project])
  end

  def primary_institution
    object.primary_institution&.id
  end

  private

  def range_for(source)
    source ||= {}
    source.fetch(object.id, { min: nil, max: nil })
  end

  def localized_descriptor(value)
    localized_hash_value(
      value,
      default_locale: object.default_locale || I18n.default_locale
    )
  end

  def serialized_affiliates(affiliates)
    affiliates.map do |affiliate|
      {
        id: affiliate.id,
        type: affiliate.type,
        name_type: affiliate.name_type,
        name: localized_affiliate_value(affiliate, :name),
        first_name: localized_affiliate_value(affiliate, :first_name),
        last_name: localized_affiliate_value(affiliate, :last_name),
      }
    end
  end

  def localized_affiliate_value(affiliate, attribute_name)
    value = localized_affiliate_attribute(affiliate, attribute_name)
    # The serialized name is a display field: Personal uses first+last, Organizational uses name.
    return affiliate_display_name(affiliate) if attribute_name.to_sym == :name

    value
  end

  def affiliate_display_name(affiliate)
    if affiliate.name_type == 'Personal'
      [
        localized_affiliate_attribute(affiliate, :first_name),
        localized_affiliate_attribute(affiliate, :last_name)
      ].compact.map(&:to_s).map(&:strip).reject(&:blank?).join(' ')
    else
      localized_affiliate_attribute(affiliate, :name).to_s.strip
    end
  end

  def localized_affiliate_attribute(affiliate, attribute_name)
    localized_attribute_value(
      affiliate,
      attribute_name,
      default_locale: object.default_locale
    ) || affiliate.send(attribute_name)
  end
end
