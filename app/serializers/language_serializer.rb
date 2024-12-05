class LanguageSerializer < ApplicationSerializer
  #languages: Language.all.map { |c| { value: c.id.to_s, name: c.localized_hash, locale: ISO_639.find(c.code.split(/[\/-]/)[0]).alpha2 } },
  attributes :id,
    :name,
    :locale,
    :code

  def name
    object.localized_hash(:name)
  end

  def locale
    l = ISO_639.find(object.code.split(/[\/-]/)[0])
    l && l.alpha3
  end
end
