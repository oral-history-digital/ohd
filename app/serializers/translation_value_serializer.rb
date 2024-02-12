class TranslationValueSerializer < ApplicationSerializer
  attributes :id, :key, :value, :code#, :locale

  def id
    object.identifier
  end

  def code
    object.key
  end

  def value
    object.localized_hash(:value)
  end
end
