class Text < ApplicationRecord
  belongs_to :project, touch: true
  validates :code, presence: true, uniqueness: { scope: :project_id }
  validates :project_id, presence: true
  translates :text, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations, allow_destroy: true
end
