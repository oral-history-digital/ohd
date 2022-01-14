require 'globalize'

class MapSection < ApplicationRecord
  belongs_to :project, touch: true

  validates :name, presence: true, uniqueness: { scope: :project_id }
  validates :corner1_lat, :corner1_lon, :corner2_lat, :corner2_lon, :order,
    :project, presence: true

  translates :label, touch: true
end
