class ExternalLinkSerializer < ApplicationSerializer
  attributes :id, 
    :name, 
    :url

  def url
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = object.url(locale)
      mem
    end
  end

end
