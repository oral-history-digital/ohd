class NormdataApiStatistic < ApplicationRecord
  belongs_to :registry_entry

  validates :search_term, presence: true

  def log_search_term(term, registry_entry)
    self.search_term = term
    self.saved_entry = registry_entry.norm_data.map{|n| "#{n.norm_data_provider.name}-#{n.nid}"}.join('_')
    self.registry_entry = registry_entry
    self.save
  end
end
