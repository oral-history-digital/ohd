class RemoveFrHeMediaPlayerResizeHandleTranslation < ActiveRecord::Migration[8.0]
  KEY = 'media_player.resize_handle_tooltip'.freeze
  LOCALES_TO_REMOVE = %w[fr he].freeze

  REMOVED_TRANSLATIONS = {
    fr: 'Redimensionner le lecteur',
    he: 'שינוי גודל הנגן'
  }.freeze

  def up
    tv = TranslationValue.find_by(key: KEY)
    return unless tv

    tv.translations.where(locale: LOCALES_TO_REMOVE).destroy_all
    tv.touch
  end

  def down
    tv = TranslationValue.find_or_create_by!(key: KEY)

    REMOVED_TRANSLATIONS.each do |locale, value|
      translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
      translation.update!(value: value)
    end

    tv.touch
  end
end