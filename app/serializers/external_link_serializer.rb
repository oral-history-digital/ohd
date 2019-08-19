class ExternalLinkSerializer < ApplicationSerializer
  attributes :id, 
    :name, 
    :url,
    :translations

  def url
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.url(locale)
      mem
    end
  end

  # serialized translations are needed to construct 'translations_attributes' e.g. in MultiLocaleInput
  # containing the id of a translation
  #
  # without the id a translation would not be updated but newly created!!
  #
  def translations
    I18n.available_locales.inject({}) do |mem, locale|
      translation = object.translations.where(locale: locale).first
      ExternalLink.last.translations.where(locale: :de).first.attributes.reject{|k,v| !ExternalLink.translated_attribute_names.include?(k.to_sym)}
      mem[locale] = translation.attributes.reject{|k,v| !(ExternalLink.translated_attribute_names + [:id]).include?(k.to_sym)}
      mem
    end
  end
end
