class RegistryReference < BaseRegistryReference
  include RefreshesSearchIndex
  before_create :write_archive_id

  refresh_search_index_on :interview_id, :ref_object_type, :ref_object_id,
    :registry_entry_id, :registry_reference_type_id

  # Refreshes affected facets, including person references previously handled by touch.
  #
  # @return [Hash{String => Array<Integer>}] Interviews on both sides of a reassignment
  def search_index_targets
    old_type = saved_change_to_ref_object_type&.first || ref_object_type
    old_id = saved_change_to_ref_object_id&.first || ref_object_id
    ids = [[ref_object_type, ref_object_id], [old_type, old_id]].flat_map do |type, object_id|
      case type
      when 'Interview' then [object_id]
      when 'Person' then Contribution.where(person_id: object_id).pluck(:interview_id)
      when 'Segment' then Segment.where(id: object_id).pluck(:interview_id)
      else []
      end
    end
    { 'Interview' => ids + search_index_interview_ids }
  end

  scope :for_interview, ->(interview_id) {
          where({interview_id: interview_id, ref_object_type: "Interview"})
        }

  scope :segments_for_interview, ->(interview_id) {
          where({interview_id: interview_id, ref_object_type: "Segment"}).
          includes(ref_object: :translations)
        }

  scope :with_locations, -> {
          joins(:registry_entry).
            includes(registry_entry: { registry_names: :translations }).
            where.not('registry_entries.longitude': nil).where.not('registry_entries.latitude': nil).where.not('interview_id': nil).
            # exclude dedalo default location (Valencia)
            where.not('registry_entries.longitude': '-0.376295').where.not('registry_entries.latitude': '39.462571')
        }

  def write_archive_id
    if ref_object_type == "Interview"
      self.archive_id = Interview.find(ref_object_id).archive_id
    elsif ref_object_type == "Segment"
      self.archive_id = Segment.find(ref_object_id).interview.archive_id
    elsif ref_object_type == "Person"
      begin
        self.archive_id = self.interview.archive_id
      rescue
        nil
      end
    end
    true
  end
end
