class RegistryEntryRepository
  def initialize(db = RegistryEntry)
    @db = db
  end

  def combined_entries_for(project_id, person_ids = [], interview_ids = [], scope = 'public')
    interview_registry_entries = interview_entries_for(
      project_id, person_ids, interview_ids, scope)
    segment_registry_entries = segment_entries_for(
      project_id, interview_ids, scope)

    hash1 = interview_registry_entries.to_h { |entry| [entry.id, entry] }
    hash2 = segment_registry_entries.to_h { |entry| [entry.id, entry] }
    hash_combined = hash1.merge(hash2) do |key, old_value, new_value|
      old_value.ref_types += "," + new_value.ref_types
      old_value
    end

    hash_combined.values
  end

  def interview_entries_for(project_id, person_ids = [], interview_ids = [], scope = 'public')
    rrt = RegistryReferenceType
      .select('registry_reference_types.id, registry_reference_types.code, metadata_fields.ref_object_type')
      .joins(:metadata_field)
      .where(metadata_fields: {project_id: project_id, ref_object_type: ["Person", "Interview"], use_in_map_search: true})
      .to_sql

    base_query = RegistryEntry
      .joins('INNER JOIN registry_names rn ON rn.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN registry_name_translations rnt ON rnt.registry_name_id = rn.id')
      .joins('INNER JOIN registry_references rr ON rr.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN interviews i ON rr.interview_id = i.id')
      .joins("LEFT OUTER JOIN (#{rrt}) AS rrt ON rr.registry_reference_type_id = rrt.id")
      .where('registry_entries.has_geo_coords': true)
    base_query = base_query.where('i.workflow_state': 'public') if scope == 'public'

    subquery = base_query
      .where('rrt.ref_object_type': "Person")
      .where('rr.ref_object_id': person_ids)
      .or(
        base_query
          .where('rrt.ref_object_type': "Interview")
          .where('rr.ref_object_id': interview_ids)
      )
      .group('registry_entries.id, rnt.locale')
      .select("registry_entries.id,
        registry_entries.longitude,
        registry_entries.latitude,
        rnt.locale,
        rnt.descriptor,
        GROUP_CONCAT(rr.registry_reference_type_id) AS ref_types")

    result = RegistryEntry
      .select('sub.id, sub.longitude, sub.latitude, sub.ref_types, JSON_OBJECTAGG(sub.locale, sub.descriptor) AS agg_names')
      .from("(#{subquery.to_sql}) AS sub")
      .group('sub.id')
    result
  end

  def segment_entries_for(project_id, interview_ids = [], scope = 'public')
    base_query = RegistryEntry
      .joins('INNER JOIN registry_names rn ON rn.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN registry_name_translations rnt ON rnt.registry_name_id = rn.id')
      .joins('INNER JOIN registry_references rr ON rr.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN interviews i ON rr.interview_id = i.id')
      .where('rr.ref_object_type': 'Segment')
      .where('i.id': interview_ids)
      .where('registry_entries.has_geo_coords': true)
    base_query = base_query.where('i.workflow_state': 'public') if scope == 'public'

    subquery = base_query
      .group('registry_entries.id, rnt.locale')
      .select("registry_entries.id,
        registry_entries.longitude,
        registry_entries.latitude,
        rnt.locale,
        rnt.descriptor,
        GROUP_CONCAT(\"S\") AS ref_types")

    result = RegistryEntry
      .select('sub.id, sub.longitude, sub.latitude, sub.ref_types, JSON_OBJECTAGG(sub.locale, sub.descriptor) AS agg_names')
      .from("(#{subquery.to_sql}) AS sub")
      .group('sub.id')
    result
  end
end
