class AddSegmentEditTranslations < ActiveRecord::Migration[8.0]
    TRANSLATIONS = {
      'modules.transcript.unsaved_changes.warning': {
          de: 'Es gibt ungespeicherte Änderungen. Wenn Sie fortfahren, gehen diese verloren. Möchten Sie fortfahren?',
          en: 'There are unsaved changes. If you continue, they will be lost. Do you want to continue?',
          el: 'Υπάρχουν μη αποθηκευμένες αλλαγές. Αν συνεχίσετε, θα χαθούν. Θέλετε να συνεχίσετε;',
          es: 'Hay cambios no guardados. Si continúa, se perderán. ¿Desea continuar?',
          ru: 'Есть несохраненные изменения. Если вы продолжите, они будут потеряны. Вы хотите продолжить?',
          uk: 'Є незбережені зміни. Якщо ви продовжите, вони будуть втрачені. Ви хочете продовжити?',
          ar: 'هناك تغييرات غير محفوظة. إذا واصلت، ستفقد. هل تريد المتابعة؟',
      },
      'modules.transcript.unsaved_changes.return': {
          de: 'Zurück',
          en: 'Return',
          el: 'Επιστροφή',
          es: 'Regresar',
          ru: 'Вернуться',
          uk: 'Повернутися',
          ar: 'عودة',
      },
      'modules.transcript.unsaved_changes.continue': {
          de: 'Fortfahren',
          en: 'Continue',
          el: 'Συνέχεια',
          es: 'Continuar',
          ru: 'Продолжить',
          uk: 'Продовжити',
          ar: 'استمر',
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
