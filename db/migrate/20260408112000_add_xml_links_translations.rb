class AddXmlLinksTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.details.xml_links.label': {
        de: 'Metadatenschnittstelle (OAI-PMH)',
        en: 'Metadata Interface (OAI-PMH)',
        el: 'Διεπαφή Μεταδεδομένων (OAI-PMH)',
        es: 'Interfaz de Metadatos (OAI-PMH)',
        ru: 'Интерфейс метаданных (OAI-PMH)',
        uk: 'Інтерфейс метаданих (OAI-PMH)',
        ar: 'واجهة البيانات الوصفية (OAI-PMH)',
    },
  }.freeze

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
