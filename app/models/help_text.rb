class HelpText < ApplicationRecord
  translates :text, :url, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates :code, uniqueness: true, presence: true
end
