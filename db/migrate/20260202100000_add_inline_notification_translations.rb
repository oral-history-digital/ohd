class AddInlineNotificationTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'inline_notification.close': {
      de: 'Schließen',
      en: 'Close',
      el: 'Κλείσιμο',
      es: 'Cerrar',
      ru: 'Закрыть',
      uk: 'Закрити',
      ar: 'إغلاق',
    },
    'inline_notification.show_more': {
      de: 'Mehr anzeigen',
      en: 'Show more',
      el: 'Εμφάνιση περισσότερων',
      es: 'Mostrar más',
      ru: 'Показать больше',
      uk: 'Показати більше',
      ar: 'عرض المزيد',
    },
    'inline_notification.show_less': {
      de: 'Weniger anzeigen',
      en: 'Show less',
      el: 'Εμφάνιση λιγότερων',
      es: 'Mostrar menos',
      ru: 'Показать меньше',
      uk: 'Показати менше',
      ar: 'عرض أقل',
    },
    'inline_notification.cancel': {
      de: 'Abbrechen',
      en: 'Cancel',
      el: 'Ακύρωση',
      es: 'Cancelar',
      ru: 'Отмена',
      uk: 'Скасувати',
      ar: 'إلغاء',
    },
    'inline_notification.submit': {
      de: 'Absenden',
      en: 'Submit',
      el: 'Υποβολή',
      es: 'Enviar',
      ru: 'Отправить',
      uk: 'Надіслати',
      ar: 'إرسال',
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
