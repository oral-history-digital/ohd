class AddLinkFieldHelpTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'modules.interview_metadata.link_field_help': {
      de: 'Links können durch Kommas oder Zeilenumbrüche getrennt werden.',
      en: 'Links can be separated by commas or line breaks.',
      el: 'Οι σύνδεσμοι μπορούν να διαχωρίζονται με κόμματα ή αλλαγές γραμμής.',
      es: 'Los enlaces se pueden separar con comas o saltos de línea.',
      ru: 'Ссылки можно разделять запятыми или переносами строк.',
      uk: 'Посилання можна розділяти комами або переносами рядків.',
      ar: 'يمكن فصل الروابط بفواصل أو أسطر جديدة.',
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

