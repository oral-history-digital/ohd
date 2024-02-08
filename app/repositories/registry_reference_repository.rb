class RegistryReferenceRepository
  def initialize(db = RegistryReference)
    @db = db
  end

  def interview_references_for(registry_entry_id, scope = 'public')
    result = @db.joins('INNER JOIN interviews i ON registry_references.interview_id = i.id')
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
        i.transcript_coupled,
        people.use_pseudonym,
        JSON_OBJECTAGG(pt.locale, pt.last_name) AS agg_last_names,
        JSON_OBJECTAGG(pt.locale, pt.first_name) AS agg_first_names,
        JSON_OBJECTAGG(pt.locale, pt.pseudonym_last_name) AS agg_pseudonym_last_names,
        JSON_OBJECTAGG(pt.locale, pt.pseudonym_first_name) AS agg_pseudonym_first_names")
    result
  end
end