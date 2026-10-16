class AddHintToOldEmailTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key('devise.mailer.hint_to_old_email.subject', {
      en: 'Changing your email address for %{umbrella_project_name}',
      de: 'Änderung Ihrer E-Mail-Adresse für %{umbrella_project_name}',
      ru: 'Изменение адреса электронной почты для %{umbrella_project_name}',
      es: 'Modificación de tu dirección de correo electrónico en %{umbrella_project_name}',
      el: 'Αλλαγή της διεύθυνσης ηλεκτρονικού ταχυδρομείου σας για το %{umbrella_project_name}',
      uk: 'Зміна вашої електронної адреси для %{umbrella_project_name}',
      ar: 'تغيير عنوان بريدك الإلكتروني في موقع %{umbrella_project_name}',
    })
  end
  def down
    TranslationValue.where(key: 'devise.mailer.hint_to_old_email.subject').destroy_all
  end
end
