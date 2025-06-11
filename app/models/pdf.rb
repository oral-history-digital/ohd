class Pdf < ApplicationRecord
  belongs_to :attachable, polymorphic: true, touch: true
  has_one_attached :file

  translates :title
  accepts_nested_attributes_for :translations
end
