class TranslationValue < ApplicationRecord

  validates :key, presence: true, uniqueness: true

  translates :value, touch: true
  accepts_nested_attributes_for :translations

  def self.create_from_hash(locale, translations_hash, old_key=nil)
    translations_hash.each do |key, value|
      if value.is_a?(Hash)
        create_from_hash(locale, value, [old_key, key].compact.join('.'))
      else
        TranslationValue.find_or_create_by(key: [old_key, key].compact.join('.')).update(value: value, locale: locale)
      end
    end
  end

  def self.for(key, locale, replacements={})
    text = find_by(key: key)&.value(locale)
    if text
      replacements.each do |k, v|
        text = text.gsub(/%{#{k}}/, v.to_s)
      end
    else
      text = "missing translation-value: #{key}"
    end
    text
  end

end
