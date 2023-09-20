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

  scope :for_map_registry_entry, -> (registry_entry_id, locale, person_ids = [], interview_ids = [], signed_in = false, scope = 'public') {
    last_name_select = signed_in ? 'person_translations.last_name' : 'SUBSTRING(person_translations.last_name,1,1) AS last_name'
    pseudonym_last_name_select = signed_in ? 'person_translations.pseudonym_last_name' : 'SUBSTRING(person_translations.pseudonym_last_name,1,1) AS pseudonym_last_name'

    entries = joins('INNER JOIN interviews ON registry_references.interview_id = interviews.id')
      .joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
      .joins('INNER JOIN metadata_fields ON registry_reference_types.id = metadata_fields.registry_reference_type_id')
      .joins('INNER JOIN contributions ON contributions.interview_id = interviews.id')
      .joins('INNER JOIN contribution_types ON contributions.contribution_type_id = contribution_types.id')
      .joins('INNER JOIN people ON contributions.person_id = people.id')
      .joins('INNER JOIN person_translations ON people.id = person_translations.person_id')
      .where('registry_entries.id': registry_entry_id)
      .where.not('registry_entries.latitude': [nil, ''])
      .where.not('registry_entries.longitude': [nil, ''])
      .where('metadata_fields.use_in_map_search': true)
      .where('contribution_types.code': 'interviewee')
      .where('interviews.workflow_state': scope == 'all' ? ['public', 'unshared'] : 'public')
      .where('person_translations.locale': locale)

    entries.where('metadata_fields.ref_object_type': 'Person')
      .where('registry_references.ref_object_id': person_ids)
      .or(
        entries.where('metadata_fields.ref_object_type': 'Interview')
          .where('registry_references.ref_object_id': interview_ids)
        )
      .select("registry_references.id, registry_reference_types.id as registry_reference_type_id, interviews.archive_id, people.use_pseudonym, person_translations.first_name, #{last_name_select}, person_translations.pseudonym_first_name, #{pseudonym_last_name_select}")
  }

  scope :for_map_segment_references, -> (registry_entry_id, locale, interview_ids, signed_in = false, scope = 'public') {
    last_name_select = signed_in ? 'person_translations.last_name' : 'SUBSTRING(person_translations.last_name,1,1) AS last_name'
    pseudonym_last_name_select = signed_in ? 'person_translations.pseudonym_last_name' : 'SUBSTRING(person_translations.pseudonym_last_name,1,1) AS pseudonym_last_name'

    joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN interviews ON registry_references.interview_id = interviews.id')
      .joins('INNER JOIN contributions ON contributions.interview_id = interviews.id')
      .joins('INNER JOIN contribution_types ON contributions.contribution_type_id = contribution_types.id')
      .joins('INNER JOIN people ON contributions.person_id = people.id')
      .joins('INNER JOIN person_translations ON people.id = person_translations.person_id')
      .joins('LEFT OUTER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
      .joins('INNER JOIN segments ON registry_references.ref_object_id = segments.id')
      .joins('INNER JOIN tapes ON segments.tape_id = tapes.id')
      .where('interviews.id': interview_ids)
      .where('registry_entries.id': registry_entry_id)
      .where.not('registry_entries.latitude': [nil, ''])
      .where.not('registry_entries.longitude': [nil, ''])
      .where('registry_references.ref_object_type': 'Segment')
      .where('contribution_types.code': 'interviewee')
      .where('interviews.workflow_state': scope == 'all' ? ['public', 'unshared'] : 'public')
      .where('person_translations.locale': locale)
      .group('registry_references.id')
      .select("registry_references.id, registry_references.ref_object_type, registry_reference_types.id AS registry_reference_type_id, segments.timecode, tapes.number AS tape_nbr, interviews.archive_id, interviews.transcript_coupled, people.use_pseudonym, person_translations.first_name, #{last_name_select}, person_translations.pseudonym_first_name, #{pseudonym_last_name_select}")
  }

  scope :for_interview_map_person_references, -> (registry_entry_id, locale, person_id) {
    joins('INNER JOIN people ON people.id = registry_references.ref_object_id')
      .joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
      .joins('INNER JOIN metadata_fields ON registry_reference_types.id = metadata_fields.registry_reference_type_id')
      .joins('INNER JOIN metadata_field_translations ON metadata_fields.id = metadata_field_translations.metadata_field_id')
      .where('registry_entries.id': registry_entry_id)
      .where.not('registry_entries.latitude': [nil, ''])
      .where.not('registry_entries.longitude': [nil, ''])
      .where('metadata_fields.ref_object_type': 'Person')
      .where('metadata_fields.use_in_map_search': true)
      .where('metadata_field_translations.locale': locale)
      .where('registry_references.ref_object_id': person_id)
      .select('registry_references.id, registry_references.ref_object_type, registry_reference_types.id as registry_reference_type_id, metadata_fields.map_color, metadata_field_translations.label')
  }

  scope :for_interview_map_interview_references, -> (registry_entry_id, locale, interview_id) {
    joins('INNER JOIN interviews ON interviews.id = registry_references.ref_object_id')
      .joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
      .joins('INNER JOIN metadata_fields ON registry_reference_types.id = metadata_fields.registry_reference_type_id')
      .joins('INNER JOIN metadata_field_translations ON metadata_fields.id = metadata_field_translations.metadata_field_id')
      .where('registry_entries.id': registry_entry_id)
      .where.not('registry_entries.latitude': [nil, ''])
      .where.not('registry_entries.longitude': [nil, ''])
      .where('metadata_fields.ref_object_type': 'Interview')
      .where('metadata_fields.use_in_map_search': true)
      .where('metadata_field_translations.locale': locale)
      .where('registry_references.ref_object_id': interview_id)
      .select('registry_references.id, registry_references.ref_object_type, registry_reference_types.id as registry_reference_type_id, metadata_fields.map_color, metadata_field_translations.label')
  }

  scope :for_interview_map_segment_references, -> (registry_entry_id, interview_id) {
    joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN interviews ON registry_references.interview_id = interviews.id')
      .joins('LEFT OUTER JOIN registry_reference_types ON registry_references.registry_reference_type_id = registry_reference_types.id')
      .joins('INNER JOIN segments ON registry_references.ref_object_id = segments.id')
      .joins('INNER JOIN tapes ON segments.tape_id = tapes.id')
      .where('interviews.id': interview_id)
      .where('registry_entries.id': registry_entry_id)
      .where.not('registry_entries.latitude': [nil, ''])
      .where.not('registry_entries.longitude': [nil, ''])
      .where('registry_references.ref_object_type': 'Segment')
      .order('tapes.number ASC, segments.timecode ASC')
      .select('registry_references.id, registry_references.ref_object_type, registry_reference_types.id AS registry_reference_type_id, segments.timecode, tapes.number AS tape_nbr, interviews.transcript_coupled')
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
