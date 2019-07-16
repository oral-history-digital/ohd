class MetadataField < ApplicationRecord

  belongs_to :project
  translates :label

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = name(locale)
      mem
    end
  end

end
