class MetadataFieldSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :name,
    :use_as_facet,
    :use_in_results_table,
    :use_in_details_view,
    :display_on_landing_page,
    :ref_object_type,
    :source,
    #:locale,
    :label,
    :values,
    :translations

  def label
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.label(locale)
      mem
    end
  end

  # serialized translations are needed to construct 'translations_attributes' e.g. in MultiLocaleInput
  # containing the id of a translation
  #
  # without the id a translation would not be updated but newly created!!
  #
  def translations
    I18n.available_locales.inject([]) do |mem, locale|
      translation = object.translations.where(locale: locale).first
      mem.push(translation.attributes.reject{|k,v| !(object.translated_attribute_names + [:id, :locale]).include?(k.to_sym)}) if translation
      mem
    end
  end
end
