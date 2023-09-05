class TranslationValue < ApplicationRecord
  translates :value

  def self.create_from_hash(locale, translations_hash, old_key=nil)
    translations_hash.each do |key, value|
      if value.is_a?(Hash)
        create_from_hash(locale, value, [old_key, key].compact.join('.'))
      else
        TranslationValue.find_or_create_by(key: [old_key, key].compact.join('.')).update(value: value, locale: locale)
      end
    end
  end
end
