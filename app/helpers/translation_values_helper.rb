module TranslationValuesHelper
  def tv(key)
    TranslationValue.for(key, I18n.locale)
  end
end
