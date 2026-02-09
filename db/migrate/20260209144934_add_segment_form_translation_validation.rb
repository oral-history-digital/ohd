class AddSegmentFormTranslationValidation < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'activerecord.errors.models.segment.attributes.speaker_id.empty': {
      de: 'Bitte Sprecher*in auswählen',
      en: 'Please select a speaker',
      el: 'Παρακαλώ επιλέξτε έναν ομιλητή',
      es: 'Por favor, seleccione orador/a',
      ru: 'Пожалуйста, выберите спикера'
    },
  }

  def up
    TRANSLATIONS.each do |key, translations|
      tv = TranslationValue.find_or_create_by(key: key)

      translations.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end
  end

  def down
    TRANSLATIONS.keys.each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end
