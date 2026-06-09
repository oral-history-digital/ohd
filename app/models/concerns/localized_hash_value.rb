module LocalizedHashValue
  private

  # Returns the best localized value using this fallback chain:
  # requested locale -> default locale -> first non-blank entry.
  def localized_hash_value(
    value,
    locale: I18n.locale,
    default_locale: I18n.default_locale,
    fallback: true
  )
    return value unless value.is_a?(Hash)

    value[locale.to_s] || # try current locale as string
      value[locale.to_sym] || # try current locale as symbol
      value[default_locale.to_s] || # try default locale as string
      value[default_locale.to_sym] || # try default locale as symbol
      (fallback ? value.values.compact.first : nil) # fallback to any available value if enabled
  end

  def localized_attribute_value(
    record,
    attribute_name,
    locale: I18n.locale,
    default_locale: I18n.default_locale,
    fallback: true
  )
    localized = record.localized_hash(attribute_name)
    return nil unless localized

    localized_hash_value(
      localized,
      locale: locale,
      default_locale: default_locale,
      fallback: fallback
    )
  end
end
