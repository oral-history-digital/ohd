module TranslationValuesHelper
  def tv(key, locale=I18n.locale)
    TranslationValue.for(key, locale)
  end
end
