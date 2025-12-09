class NormdataApiStatistic < ApplicationRecord
  belongs_to :registry_entry

  validates :search_term, presence: true

  def log_search_term(search_term, re)
    if search_term.present? && re.norm_data.any?
      self.search_term = search_term
      self.saved_entry = re.norm_data.map{|n| "#{n.norm_data_provider.name}-#{n.nid}"}.join('_')
      self.registry_entry = registry_entry
      self.save
    end
  end
end
