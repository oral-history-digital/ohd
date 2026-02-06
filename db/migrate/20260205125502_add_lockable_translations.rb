class AddLockableTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('devise.failure.locked', {
      en: "Too many failed login attempts. Try again later or reset your password.",
      de: "Zu viele fehlgeschlagene Anmeldeversuche. Versuchen Sie es später erneut oder setzen Sie Ihr Passwort zurück.",
      ru: "Слишком много неудачных попыток входа. Попробуйте позже или сбросьте пароль."
    })
  end

  def down
    TranslationValue.where(key: [
      'devise.failure.locked'
    ]).destroy_all
  end
end
