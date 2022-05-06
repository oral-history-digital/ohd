class NormDatum < ApplicationRecord
  belongs_to :norm_data_provider
  belongs_to :registry_entry
  validates :norm_data_provider_id, presence: true
  validates :nid, presence: true
end
