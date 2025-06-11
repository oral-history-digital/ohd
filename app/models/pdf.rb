require 'globalize'

class Pdf < ApplicationRecord
  belongs_to :attachable, polymorphic: true, touch: true
  has_one_attached :file

  translates :name, :description, :date, fallbacks_for_empty_translations: false, touch: true
  accepts_nested_attributes_for :translations
end
