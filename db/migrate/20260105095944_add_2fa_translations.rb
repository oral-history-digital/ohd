class Add2faTranslations < ActiveRecord::Migration[8.0]
  def up
    TranslationValue.create_or_update_for_key(:login_with_passkey, {
        en: 'Login with Passkey',
        de: 'Mit Passkey anmelden',
        ru: 'Войти с помощью Passkey'
    })
  end

  def down
    TranslationValue.where(key: 'login_with_passkey').destroy_all
  end
end
