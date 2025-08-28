class AddTranslationMediaPlayerSubtitles < ActiveRecord::Migration[7.0]
  def up
    # Helper method to create or update translations
    def set_translation(key, translations_hash)
      tv = TranslationValue.find_or_create_by(key: key)
      
      translations_hash.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end

    # Subtitle settings
    set_translation('media_player.subtitles_settings', {
      en: 'Settings',
      de: 'Einstellungen'
    })

    # Subtitles off
    set_translation('media_player.subtitles_off', {
      en: 'Off',
      de: 'Aus'
    })
  end

  def down
    # Remove all translations
    ['media_player.subtitles_settings', 
     'media_player.subtitles_off'].each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end