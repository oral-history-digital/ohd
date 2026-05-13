class Affiliate < ApplicationRecord
  belongs_to :project, touch: true
  translates :name, :first_name, :last_name,
    fallbacks_for_empty_translations: true,
    touch: true
  accepts_nested_attributes_for :translations, allow_destroy: true
end
