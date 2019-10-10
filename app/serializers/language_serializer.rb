class LanguageSerializer < ApplicationSerializer
        #languages: Language.all.map { |c| { value: c.id.to_s, name: c.localized_hash, locale: ISO_639.find(c.code.split(/[\/-]/)[0]).alpha2 } },
  attributes :id,
    :name,
    :locale

  def name
    object.localized_hash
  end

  def locale
  end

end
