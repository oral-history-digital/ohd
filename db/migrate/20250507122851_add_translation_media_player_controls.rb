class AddTranslationMediaPlayerControls < ActiveRecord::Migration[7.0]
  def up
    # Helper method to create or update translations
    def set_translation(key, translations_hash)
      tv = TranslationValue.find_or_create_by(key: key)
      
      translations_hash.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end

    # Toggle player size button
    set_translation('media_player.toggle_size_button', {
      en: 'Toggle player size',
      de: 'Player-Größe umschalten',
      ru: 'Изменить размер плеера'
    })

    # Playback rate menu
    set_translation('media_player.playback_rate', {
      en: 'Speed',
      de: 'Geschwindigkeit',
      ru: 'Скорость'
    })

    # Playback quality menu
    set_translation('media_player.playback_quality', {
      en: 'Quality',
      de: 'Qualität',
      ru: 'Качество'
    })
  end

  def down
    # Remove all translations
    ['media_player.toggle_size_button', 
     'media_player.playback_rate', 
     'media_player.playback_quality'].each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end