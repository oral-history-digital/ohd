class RemoveUnusedUmbrellaProjectTranslations < ActiveRecord::Migration[8.0]
  REMOVED_TRANSLATIONS = {
    'modules.project_access.request_access_explanation1' => {
      'ar' => 'أنت مًسجّل بالفعل في Oral-History.Digital.، ولكنك غير مفعّل لهذا الأرشيف بعد.',
      'de' => 'Sie sind bereits in Oral-History.Digital registriert, aber noch nicht für dieses Archiv freigeschaltet.',
      'el' => 'Είστε ήδη εγγεγραμμένος στο Oral-History.Digital, αλλά δεν έχετε ενεργοποιήσει ακόμα αυτό το αρχείο.',
      'en' => 'You are already registered in Oral-History.Digital, but not yet activated for this archive.',
      'es' => 'Ya está registrado/a en Oral-History.Digital, pero aún no está activado su acceso para este archivo.',
      'ru' => 'Вы уже зарегистрированы на портале Oral-History.Digital, но еще не получили допуск к этому архиву.',
      'uk' => 'Ви вже зареєстровані в Oral-History.Digital, але ще не активовані для цього архіву.'
    },
    'modules.registration.registration_needed_archive' => {
      'ar' => 'للوصول إلى المقابلات، يلزم التسجيل في Oral-History.Digital وتفعيل الأرشيف. ',
      'de' => 'Um auf die Interviews zuzugreifen, ist eine Registrierung in Oral-History.Digital und eine Freischaltung für das Archiv notwendig.',
      'el' => 'Για να αποκτήσετε πρόσβαση στις συνεντεύξεις πρέπει να πραγματοποιήσετε εγγραφή στο Oral-History. Digital και να ενεργοποιήσετε το Aρχείο',
      'en' => 'Access to the interviews requires registration on the Oral-History.Digital platform and activation for the archive.',
      'es' => 'Para acceder a las entrevistas, es necesario registrarse en Oral-History.Digital y solicitar el acceso al archivo.',
      'ru' => 'Для получения доступа к интервью необходима регистрация на платформе Oral-History.Digital и активация допуска к архиву.',
      'uk' => "Доступ до інтерв'ю вимагає реєстрації в Oral-History.Digital і активації для архіву"
    },
    'modules.registration.registration_needed_ohd' => {
      'de' => 'Um auf die Interviews zuzugreifen, ist eine Registrierung in Oral-History.Digital und ggf. eine Freischaltung für einzelne Archive notwendig.',
      'el' => 'Για να αποκτήσετε πρόσβαση στις συνεντεύξεις πρέπει να πραγματοποιήσετε εγγραφή στο Oral-History. Digital και, εάν είναι απαραίτητο να ενεργοποιήσετε τα επιμέρους αρχεία.',
      'en' => 'Access to the interviews requires registration on the Oral-History.Digital platform and, if necessary, activation for individual archives.',
      'es' => 'Para acceder a las entrevistas, es necesario registrarse en Oral-History.Digital y, en caso necesario, solicitar el acceso a los archivos individuales.',
      'ru' => 'Для получения доступа к интервью необходима регистрация на платформе Oral-History.Digital и при необходимости – активация допуска к одному из архивов.'
    }
  }.freeze

  def up
    TranslationValue.where(key: REMOVED_TRANSLATIONS.keys).destroy_all
  end

  def down
    REMOVED_TRANSLATIONS.each do |key, translations|
      TranslationValue.create_or_update_for_key(key, translations)
    end
  end
end
