class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def localized_hash(att)
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = self.send(att, locale) 
      mem
    end
  end

end
