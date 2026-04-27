class Affiliate < ApplicationRecord
  belongs_to :project, touch: true
end
