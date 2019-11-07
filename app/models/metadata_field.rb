require 'globalize'
class MetadataField < ApplicationRecord

  belongs_to :project
  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
  serialize :values

  before_destroy :touch_project #in order to generate a new cache key

  def localized_hash
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = label(locale) || I18n.t(".#{name}")
      mem
    end
  end

  def touch_project
    project.touch
  end
end
