class EventType < ApplicationRecord
  belongs_to :project, touch: true
  has_many :events, dependent: :destroy

  translates :name, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates :code, presence: true, uniqueness: { scope: :project_id },
    length: { in: 2..20 }
  validates :name, length: { maximum: 100 }
  validates :project, presence: true
end
