class NormDatum < ApplicationRecord
  belongs_to :norm_data_provider
  belongs_to :registry_entry, touch: true
  validates :norm_data_provider_id, presence: true
  validates :nid, presence: true
  validates :registry_entry_id, uniqueness: { scope: :norm_data_provider_id }

  scope :by_provider, ->(provider_name) { joins(:norm_data_provider).where(norm_data_providers: { name: provider_name }) }
  scope :gnd, -> { joins(:norm_data_provider).where(norm_data_providers: { name: 'gnd' }) }
  scope :osm, -> { joins(:norm_data_provider).where(norm_data_providers: { name: 'osm' }) }
end
