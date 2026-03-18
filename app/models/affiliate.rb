class Affiliate < ApplicationRecord
  belongs_to :project, touch: true
  validates :name, presence: true
end
