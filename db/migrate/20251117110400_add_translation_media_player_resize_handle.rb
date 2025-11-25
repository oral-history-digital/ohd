class AddTranslationMediaPlayerResizeHandle < ActiveRecord::Migration[8.0]
  def up
    # Helper method to create or update translations
    def set_translation(key, translations_hash)
      tv = TranslationValue.find_or_create_by(key: key)
      
      translations_hash.each do |locale, value|
        translation = tv.translations.find_or_initialize_by(locale: locale.to_s)
        translation.update(value: value)
      end
    end

    # Resize handler tooltip
    set_translation('media_player.resize_handle_tooltip', {
      en: 'Resize player',
      de: 'Playergröße ändern',
      es: 'Redimensionar reproductor',
      fr: 'Redimensionner le lecteur',
      ru: 'Изменить размер плеера',
      ar: 'تغيير حجم المشغّل',
      he: 'שינוי גודל הנגן'
    })

  end

  def down
    # Remove translation
    ['media_player.resize_handle_tooltip'].each do |key|
      TranslationValue.where(key: key).destroy_all
    end
  end
end