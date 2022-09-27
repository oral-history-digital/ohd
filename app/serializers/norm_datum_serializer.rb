class NormDatumSerializer < ApplicationSerializer
  attributes :id, :norm_data_provider_id, :nid, :registry_entry_id, :norm_data_provider
  belongs_to :norm_data_provider
end
