class NormDatum < ApplicationRecord
  belongs_to :registry_entry
  validates :provider, presence: true
  validates :nid, presence: true
end
