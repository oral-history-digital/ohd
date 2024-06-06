class RegistryReference < BaseRegistryReference
  before_create :write_archive_id

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
