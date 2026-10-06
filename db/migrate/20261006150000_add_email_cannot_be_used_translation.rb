class AddEmailCannotBeUsedTranslation < ActiveRecord::Migration[8.0]
  KEY = 'user.email_cannot_be_used'.freeze
  TRANSLATIONS = {
    de: 'Diese E-Mail-Adresse kann nicht verwendet werden. Bitte geben Sie eine andere E-Mail-Adresse ein.',
    en: 'This email address cannot be used. Please enter a different email address.',
    es: 'Esta dirección de correo electrónico no se puede utilizar. Introduzca otra dirección de correo electrónico.',
    el: 'Αυτή η διεύθυνση email δεν μπορεί να χρησιμοποιηθεί. Εισαγάγετε μια διαφορετική διεύθυνση email.',
    ru: 'Этот адрес электронной почты нельзя использовать. Введите другой адрес электронной почты.',
    uk: 'Цю адресу електронної пошти не можна використовувати. Введіть іншу адресу електронної пошти.',
    ar: 'لا يمكن استخدام عنوان البريد الإلكتروني هذا. يُرجى إدخال عنوان بريد إلكتروني آخر.',
  }.freeze

  def up
    value = TranslationValue.find_or_create_by!(key: KEY)
    TRANSLATIONS.each do |locale, text|
      value.translations.find_or_initialize_by(locale: locale.to_s).update!(value: text)
    end
  end

  def down
    TranslationValue.where(key: KEY).destroy_all
  end
end
