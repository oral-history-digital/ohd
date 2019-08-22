require 'globalize'
class MetadataField < ApplicationRecord

  belongs_to :project
  translates :label
  accepts_nested_attributes_for :translations
  serialize :values

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = label(locale)
      mem
    end
  end

end
