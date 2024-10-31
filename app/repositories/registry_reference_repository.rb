class RegistryReferenceRepository
  def initialize(db = RegistryReference)
    @db = db
  end

  # For registry.
  def interview_references_for(registry_entry_id, scope = 'public')
    result = @db.joins('INNER JOIN interviews i ON registry_references.interview_id = i.id')
      .joins('INNER JOIN projects p ON i.project_id = p.id')
      .joins('INNER JOIN registry_entries re ON registry_references.registry_entry_id = re.id')
      .joins('INNER JOIN contributions c ON c.interview_id = i.id')
      .joins('INNER JOIN contribution_types ct ON c.contribution_type_id = ct.id')
      .joins('INNER JOIN people ON c.person_id = people.id')
      .joins('INNER JOIN person_translations pt ON people.id = pt.person_id')
      .where('re.id': registry_entry_id)
      .where('ct.code': 'interviewee')
      .where('i.workflow_state': scope == 'all' ? ['public', 'unshared'] : 'public')
      .group('i.archive_id')
      .select("registry_references.id,
        i.archive_id,
        i.project_id,
        p.shortname,
        people.use_pseudonym,
        JSON_OBJECTAGG(pt.locale, pt.last_name) AS agg_last_names,
        JSON_OBJECTAGG(pt.locale, pt.first_name) AS agg_first_names,
        JSON_OBJECTAGG(pt.locale, pt.pseudonym_last_name) AS agg_pseudonym_last_names,
        JSON_OBJECTAGG(pt.locale, pt.pseudonym_first_name) AS agg_pseudonym_first_names")
    result
  end

  def segment_references_for(registry_entry_id, scope = 'public')
    result = @db.joins('INNER JOIN registry_entries re ON registry_references.registry_entry_id = re.id')
      .joins('INNER JOIN interviews i ON registry_references.interview_id = i.id')
      .joins('INNER JOIN projects p ON i.project_id = p.id')
      .joins('INNER JOIN contributions c ON c.interview_id = i.id')
      .joins('INNER JOIN contribution_types ct ON c.contribution_type_id = ct.id')
      .joins('INNER JOIN people ON c.person_id = people.id')
      .joins('INNER JOIN person_translations pt ON people.id = pt.person_id')
      .joins('LEFT OUTER JOIN registry_reference_types rrt ON registry_references.registry_reference_type_id = rrt.id')
      .joins('INNER JOIN segments s ON registry_references.ref_object_id = s.id')
      .joins('INNER JOIN tapes t ON s.tape_id = t.id')
      .where('re.id': registry_entry_id)
      .where('registry_references.ref_object_type': 'Segment')
      .where('ct.code': 'interviewee')
      .where('i.workflow_state': scope == 'all' ? ['public', 'unshared'] : 'public')
      .group('registry_references.id')
      .select("registry_references.id,
        registry_references.ref_object_type,
        s.timecode,
        t.number AS tape_nbr,
        i.archive_id,
        i.project_id,
        p.shortname,
        i.transcript_coupled,
        people.use_pseudonym,
        JSON_OBJECTAGG(pt.locale, pt.last_name) AS agg_last_names,
        JSON_OBJECTAGG(pt.locale, pt.first_name) AS agg_first_names,
        JSON_OBJECTAGG(pt.locale, pt.pseudonym_last_name) AS agg_pseudonym_last_names,
        JSON_OBJECTAGG(pt.locale, pt.pseudonym_first_name) AS agg_pseudonym_first_names")
    result
  end

  # For map.
  def map_interview_references_for(registry_entry_id, person_ids = [], interview_ids = [], scope = 'public')
    entries = @db.joins('INNER JOIN interviews ON registry_references.interview_id = interviews.id')
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

    result = entries.where('metadata_fields.ref_object_type': 'Person')
      .where('registry_references.ref_object_id': person_ids)
      .or(
        entries.where('metadata_fields.ref_object_type': 'Interview')
          .where('registry_references.ref_object_id': interview_ids)
        )
      .group('registry_references.id')
      .select("registry_references.id,
        registry_reference_types.id as registry_reference_type_id,
        interviews.archive_id,
        interviews.project_id,
        people.use_pseudonym,
        JSON_OBJECTAGG(person_translations.locale, person_translations.last_name) AS agg_last_names,
        JSON_OBJECTAGG(person_translations.locale, person_translations.first_name) AS agg_first_names,
        JSON_OBJECTAGG(person_translations.locale, person_translations.pseudonym_last_name) AS agg_pseudonym_last_names,
        JSON_OBJECTAGG(person_translations.locale, person_translations.pseudonym_first_name) AS agg_pseudonym_first_names")
    result
  end

  def map_segment_references_for(registry_entry_id, interview_ids, scope = 'public')
    result = @db.joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
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
      .group('registry_references.id')
      .select("registry_references.id,
        registry_references.ref_object_type,
        segments.timecode,
        tapes.number AS tape_nbr,
        interviews.archive_id,
        interviews.project_id,
        interviews.transcript_coupled,
        people.use_pseudonym,
        JSON_OBJECTAGG(person_translations.locale, person_translations.last_name) AS agg_last_names,
        JSON_OBJECTAGG(person_translations.locale, person_translations.first_name) AS agg_first_names,
        JSON_OBJECTAGG(person_translations.locale, person_translations.pseudonym_last_name) AS agg_pseudonym_last_names,
        JSON_OBJECTAGG(person_translations.locale, person_translations.pseudonym_first_name) AS agg_pseudonym_first_names")
    result
  end

  # For single interview map.
  def interview_map_person_references_for(registry_entry_id, locale, person_id)
    result = @db.joins('INNER JOIN people ON people.id = registry_references.ref_object_id')
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
    result
  end

  def interview_map_interview_references_for(registry_entry_id, locale, interview_id)
    result = @db.joins('INNER JOIN interviews ON interviews.id = registry_references.ref_object_id')
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
    result
  end

  def interview_map_segment_references_for(registry_entry_id, interview_id)
    result = @db.joins('INNER JOIN registry_entries ON registry_references.registry_entry_id = registry_entries.id')
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
    result
  end
end
