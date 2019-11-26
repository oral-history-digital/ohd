class RegistryReference < BaseRegistryReference
  belongs_to :interview
  belongs_to :ref_object, polymorphic: true
  belongs_to :registry_reference_type

  after_update :touch_objects
  before_destroy :touch_objects
  after_create :touch_objects

  scope :for_interview, ->(interview_id) {
          where(interview_id: interview_id)
        }

  scope :segments_for_interview, ->(interview_id) {
          where({ interview_id: interview_id, ref_object_type: "Segment" })
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
  end
end
