class MetadataField < ApplicationRecord

  belongs_to :project
  translates :label
  serialize :values

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = label(locale)
      mem
    end
  end

end
