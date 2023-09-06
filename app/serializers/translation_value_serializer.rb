class TranslationValueSerializer < ApplicationSerializer
  attributes :id, :key, :value, :code#, :locale

  def code
    object.key
  end

  def value
    object.localized_hash(:value)
  end
end
