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

  scope :for_map_registry_entry, -> (registry_entry_id, locale, person_ids, signed_in) {
    last_name_select = signed_in ? 'person_translations.last_name' : 'SUBSTRING(person_translations.last_name,1,1) AS last_name'

    joins('INNER JOIN interviews ON registry_references.interview_id = interviews.id')
    .joins('INNER JOIN people ON people.id = registry_references.ref_object_id')
    .joins('INNER JOIN person_translations ON people.id = person_translations.person_id')
    .joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
    .joins('INNER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
    .joins('INNER JOIN metadata_fields ON registry_reference_types.id = metadata_fields.registry_reference_type_id')
    .where('registry_entries.id = ?', registry_entry_id)
    .where.not('registry_entries.latitude': [nil, ''])
    .where.not('registry_entries.longitude': [nil, ''])
    .where('metadata_fields.ref_object_type="Person" AND metadata_fields.use_in_map_search IS TRUE')
    .where(ref_object_id: person_ids)
    .where('person_translations.locale = ?', locale)
    .where('interviews.workflow_state="public"')
    .select("registry_references.id, registry_reference_types.id as registry_reference_type_id, interviews.archive_id, person_translations.first_name, #{last_name_select}")
  }

  scope :for_interview_map_person_references, -> (registry_entry_id, locale, person_id) {
    joins('INNER JOIN people ON people.id = registry_references.ref_object_id')
    .joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
    .joins('INNER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
    .joins('INNER JOIN metadata_fields ON registry_reference_types.id = metadata_fields.registry_reference_type_id')
    .joins('INNER JOIN metadata_field_translations ON metadata_fields.id = metadata_field_translations.metadata_field_id')
    .where('registry_entries.id = ?', registry_entry_id)
    .where.not('registry_entries.latitude': [nil, ''])
    .where.not('registry_entries.longitude': [nil, ''])
    .where('metadata_fields.ref_object_type="Person" AND metadata_fields.use_in_map_search IS TRUE')
    .where('metadata_field_translations.locale = ?', locale)
    .where('registry_references.ref_object_id = ?', person_id)
    .select('registry_references.id, registry_references.ref_object_type, registry_reference_types.id as registry_reference_type_id, metadata_fields.map_color, metadata_field_translations.label')
  }

  scope :for_interview_map_segment_references, -> (registry_entry_id, interview_id) {
    joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
    .joins('INNER JOIN interviews ON registry_references.interview_id = interviews.id')
    .joins('LEFT OUTER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
    .joins('INNER JOIN segments ON registry_references.ref_object_id = segments.id')
    .joins('INNER JOIN tapes ON segments.tape_id = tapes.id')
    .where('interviews.id = ?', interview_id)
    .where('registry_entries.id = ?', registry_entry_id)
    .where.not('registry_entries.latitude': [nil, ''])
    .where.not('registry_entries.longitude': [nil, ''])
    .where('registry_references.ref_object_type = "Segment"')
    .select('registry_references.id, registry_references.ref_object_type, registry_reference_types.id AS registry_reference_type_id, segments.timecode, tapes.number AS tape_nbr')
  }

  def write_archive_id
    if ref_object_type == "Interview"
      self.archive_id = Interview.find(ref_object_id).archive_id
    elsif ref_object_type == "Segment"
      self.archive_id = Segment.find(ref_object_id).interview.archive_id
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
