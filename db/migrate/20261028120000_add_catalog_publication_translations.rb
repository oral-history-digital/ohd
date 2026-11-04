# Adds labels for catalog publication status and its sidebar filter.
class AddCatalogPublicationTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'explorer.project_not_public' => {
      de: 'Nicht veröffentlicht',
      en: 'Unpublished',
      es: 'No publicado',
      el: 'Μη δημοσιευμένο',
      ru: 'Не опубликован',
      uk: 'Не опубліковано',
      ar: 'غير منشور',
    },
    'explorer.filter.show_unpublished_projects' => {
      de: 'Unveröffentlichte Archive anzeigen',
      en: 'Show unpublished archives',
      es: 'Mostrar archivos no publicados',
      el: 'Εμφάνιση μη δημοσιευμένων αρχείων',
      ru: 'Показать неопубликованные архивы',
      uk: 'Показати неопубліковані архіви',
      ar: 'عرض الأرشيفات غير المنشورة',
    },
  }.freeze

  # Stores the labels in the runtime translation database.
  # @return [void]
  def up
    TRANSLATIONS.each do |key, translations|
      value = TranslationValue.find_or_create_by!(key: key)
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale.to_s).update!(value: text)
      end
    end
  end

  # Removes the labels introduced by this migration.
  # @return [void]
  def down
    TranslationValue.where(key: TRANSLATIONS.keys).destroy_all
  end
end
