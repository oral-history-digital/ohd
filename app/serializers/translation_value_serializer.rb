class TranslationValueSerializer < ApplicationSerializer
  attributes :id, :key, :value, :locale

  def value
    object.localized_hash(:value)
  end
end
