class RegistryReference < BaseRegistryReference
  belongs_to :interview
  belongs_to :ref_object, polymorphic: true
  belongs_to :registry_reference_type

  before_create :write_archive_id
  after_commit :touch_objects, on: [:create, :update, :destroy]

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

  def touch_objects
    RegistryEntry.find(registry_entry_id).touch
    ref_object_type.constantize.find(ref_object_id).touch
    # reindex interview when updated person-references
    if (ref_object_type == "Person" && ref_object_type.constantize.find(ref_object_id).respond_to?(:interviews))
      ref_object_type.constantize.find(ref_object_id).interviews.map(&:save)
    end
  end

  def write_archive_id
    if ref_object_type == "Interview"
      self.archive_id = Interview.find(ref_object_id).archive_id
    elsif ref_object_type == "Segment"
      update_attributes archive_id: Segment.find(ref_object_id).archive_id
    elsif ref_object_type == "Person"
      begin
        self.archive_id = Person.find(ref_object_id).interviews.first.archive_id
      rescue
        nil
      end
    end
    true
  end
end
