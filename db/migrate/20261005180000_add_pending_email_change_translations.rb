class AddPendingEmailChangeTranslations < ActiveRecord::Migration[8.0]
  TRANSLATIONS = {
    'user.pending_email_change.notice' => {
      de: 'Die Änderung zu %{email} wartet auf Ihre Bestätigung. Bis dahin bleibt Ihre bisherige E-Mail-Adresse gültig.',
      en: 'Your change to %{email} is awaiting confirmation. Until then, your current email address remains active.',
      es: 'El cambio a %{email} está pendiente de confirmación. Hasta entonces, su dirección de correo electrónico actual sigue activa.',
      el: 'Η αλλαγή σε %{email} αναμένει επιβεβαίωση. Μέχρι τότε, η τρέχουσα διεύθυνση email σας παραμένει ενεργή.',
      ru: 'Изменение адреса на %{email} ожидает подтверждения. До этого ваш текущий адрес электронной почты остаётся действующим.',
      uk: 'Зміна адреси на %{email} очікує підтвердження. До цього ваша поточна адреса електронної пошти залишається чинною.',
      ar: 'تغيير عنوان بريدك الإلكتروني إلى %{email} بانتظار التأكيد. حتى ذلك الحين، يظل عنوان بريدك الإلكتروني الحالي فعّالًا.',
    },

    'user.pending_email_change.cancel' => {
      de: 'E-Mail-Änderung abbrechen',
      en: 'Cancel email change',
      es: 'Cancelar el cambio de correo electrónico',
      el: 'Ακύρωση αλλαγής email',
      ru: 'Отменить изменение адреса электронной почты',
      uk: 'Скасувати зміну адреси електронної пошти',
      ar: 'إلغاء تغيير البريد الإلكتروني',
    },

    'user.pending_email_change.error' => {
      de: 'Die E-Mail-Änderung konnte nicht abgebrochen werden. Bitte versuchen Sie es erneut.',
      en: 'The email change could not be cancelled. Please try again.',
      es: 'No se pudo cancelar el cambio de correo electrónico. Inténtelo de nuevo.',
      el: 'Δεν ήταν δυνατή η ακύρωση της αλλαγής email. Δοκιμάστε ξανά.',
      ru: 'Не удалось отменить изменение адреса электронной почты. Попробуйте ещё раз.',
      uk: 'Не вдалося скасувати зміну адреси електронної пошти. Спробуйте ще раз.',
      ar: 'تعذّر إلغاء تغيير البريد الإلكتروني. يُرجى المحاولة مرة أخرى.',
    },
  }.freeze

  def up
    TRANSLATIONS.each do |key, translations|
      value = TranslationValue.find_or_create_by!(key: key)
      translations.each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale.to_s).update!(value: text)
      end
    end
  end

  def down
    TranslationValue.where(key: TRANSLATIONS.keys).destroy_all
  end
end
