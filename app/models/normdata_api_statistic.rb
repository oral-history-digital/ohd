class NormdataApiStatistic < ApplicationRecord
  belongs_to :registry_entry

  validates :search_term, presence: true

  def log_search_term(search_term, registry_entry)
    if search_term.present? && registry_entry.norm_data.any?
      self.search_term = search_term
      self.saved_entry = registry_entry.norm_data.map{|n| "#{n.norm_data_provider.name}-#{n.nid}"}.join('_')
      self.registry_entry = registry_entry
      self.save
    end
  end
end
