class TranslationValue < ApplicationRecord

  validates :key, presence: true, uniqueness: true

  translates :value, touch: true
  accepts_nested_attributes_for :translations

  # Clear cache when translations are modified
  after_save :clear_cache
  after_destroy :clear_cache

  def clear_cache
    self.class.clear_translation_cache!
  end

  #def identifier
    #key.parameterize
  #end

  def self.create_from_hash(locale, translations_hash, old_key=nil)
    translations_hash.each do |key, value|
      if value.is_a?(Hash)
        create_from_hash(locale, value, [old_key, key].compact.join('.'))
      else
        TranslationValue.find_or_create_by(key: [old_key, key].compact.join('.')).update(value: value, locale: locale)
      end
    end
  end

  # Cache for translation lookups to avoid N+1 queries
  # This cache persists for the lifetime of the class in memory
  def self.translation_cache
    @translation_cache ||= {}
  end

  def self.clear_translation_cache!
    @translation_cache = {}
  end

  def self.for(key, locale, replacements={}, fallback_to_key=false)
    # Use request-level caching to avoid repeated DB queries
    cache_key = "#{key}-#{locale}"
    
    unless translation_cache.key?(cache_key)
      translation_cache[cache_key] = find_by(key: key)&.value(locale)
    end
    
    text = translation_cache[cache_key]
    
    if text
      # Apply replacements to a copy to avoid caching interpolated versions
      result = text.dup
      replacements.each do |k, v|
        result = result.gsub(/%{#{k}}/, v.to_s)
      end
      result
    else
      if fallback_to_key
        key.split('.').last
      else
        "missing translation-value: #{key}"
      end
    end
  end

  def self.available?(key, locale)
    cache_key = "#{key}-#{locale}"
    
    unless translation_cache.key?(cache_key)
      translation_cache[cache_key] = find_by(key: key)&.value(locale)
    end
    
    !!translation_cache[cache_key]
  end
end
