# Resolves proposed speaker designations without changing stored contributions.
class TranscriptImportContributions
  # @param interview [Interview] Destination interview
  # @param attributes [Hash, nil] Proposed designation updates keyed by form index
  # @return [Array<Contribution>] Unsaved contribution values with proposed designations
  # @raise [ActiveRecord::RecordNotFound] If an update targets another interview's contribution
  def self.resolve(interview, attributes)
    contributions = interview.contributions.reload.to_a
    (attributes || {}).each_value do |values|
      contribution = contributions.find { |record| record.id.to_s == values[:id].to_s }
      raise ActiveRecord::RecordNotFound, 'Contribution not found in the destination interview' unless contribution

      contribution.speaker_designation = values[:speaker_designation]
    end
    contributions
  end
end
