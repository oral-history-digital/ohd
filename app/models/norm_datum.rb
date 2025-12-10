class NormDatum < ApplicationRecord
  belongs_to :norm_data_provider
  belongs_to :registry_entry, touch: true
  validates :norm_data_provider_id, presence: true
  validates :nid, presence: true

  scope :by_provider, ->(provider_id) { where(norm_data_provider_id: provider_id) }
  scope :gnd, -> { joins(:norm_data_provider).where(norm_data_providers: { name: 'gnd' }) }
  scope :osm, -> { joins(:norm_data_provider).where(norm_data_providers: { name: 'osm' }) }
end
