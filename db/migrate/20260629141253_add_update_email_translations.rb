class AddUpdateEmailTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('devise.registrations.update_email', {
      de: 'Die geänderte E-Mail-Adresse wird sichtbar, sobald Sie diese bestätigt haben. Eine E-Mail mit Bestätigungslink wurde Ihnen gerade an die neue E-Mail-Adresse zugeschickt.',
      en: 'The changed email address will be visible once you have confirmed it. An email with a confirmation link has just been sent to your new email address.',
      es: 'La dirección de correo electrónico modificada será visible una vez que la hayas confirmado. Se acaba de enviar un correo electrónico con un enlace de confirmación a tu nueva dirección de correo electrónico.',
      ru: 'Измененный адрес электронной почты будет виден после того, как вы его подтвердите. На ваш новый адрес электронной почты только что было отправлено письмо со ссылкой для подтверждения.',
      el: 'Η αλλαγμένη διεύθυνση ηλεκτρονικού ταχυδρομείου θα είναι ορατή μόλις την επιβεβαιώσετε. Ένα email με έναν σύνδεσμο επιβεβαίωσης μόλις εστάλη στη νέα σας διεύθυνση email.',
      uk: 'Змінена адреса електронної пошти стане видимою, щойно ви її підтвердите. На вашу нову адресу електронної пошти щойно було надіслано лист із посиланням для підтвердження.',
      ar: 'سيظهر عنوان البريد الإلكتروني المعدل فور تأكيده. وقد تم للتو إرسال رسالة بريد إلكتروني تحتوي على رابط التأكيد إلى عنوان بريدك الإلكتروني الجديد.',
    })
  end

  def down
    TranslationValue.where(key: 'devise.registrations.update_email').destroy_all
  end
end
