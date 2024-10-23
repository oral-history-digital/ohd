class RegistryEntryRepository
  def initialize(project_id, person_ids = [], interview_ids = [], scope = 'public')
    @project_id = project_id
    @person_ids = person_ids
    @interview_ids = interview_ids
    @scope_is_public = scope == 'public'
  end

  def combined_entries_for_map()
    result = RegistryEntry
      .select('reg_with_counts.id, re.latitude AS lat, re.longitude AS lon, reg_with_counts.ref_type_counts AS ref_types, JSON_OBJECTAGG(rnt.locale, rnt.descriptor) AS labels')
      .from("(#{merged_reg_entries().to_sql}) AS reg_with_counts")
      .joins('INNER JOIN registry_entries re ON re.id = reg_with_counts.id')
      .joins('INNER JOIN registry_names rn ON rn.registry_entry_id = reg_with_counts.id')
      .joins('INNER JOIN registry_name_translations rnt ON rnt.registry_name_id = rn.id')
      .where('rnt.locale != "alias"')
      .group('reg_with_counts.id')
    result
  end

  def merged_reg_entries()
    result = RegistryEntry
      .select('merged.id, JSON_ARRAYAGG(merged.ref_type_counts) AS ref_type_counts')
      .from("(#{ref_type_aggregated_count_subquery().to_sql} UNION ALL #{segment_count_subquery().to_sql}) AS merged")
      .group('merged.id')
    result
  end

  def ref_type_aggregated_count_subquery()
    # Returns rows like this:
    # id       ref_type_counts
    # 90408900 {"90408824":1, "90408826":1, "90408827":1}
    result = RegistryEntry
      .select('sub.id, JSON_OBJECTAGG(sub.registry_reference_type_id,	sub.ref_type_count) AS ref_type_counts')
      .from("(#{ref_type_count_subquery().to_sql}) AS sub")
      .group('sub.id')
    result
  end

  def ref_type_count_subquery()
    result = RegistryEntry
      .joins('INNER JOIN registry_references rr ON rr.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN interviews i ON rr.interview_id = i.id')
      .joins("LEFT OUTER JOIN (#{ref_type_subquery().to_sql}) AS rrt ON rr.registry_reference_type_id = rrt.id")
      .where('registry_entries.has_geo_coords': true)
    result = result.where('i.workflow_state': 'public') if @scope_is_public
    result = result.where('rrt.ref_object_type': "Person").where('rr.ref_object_id': @person_ids)
      .or(result.where('rrt.ref_object_type': "Interview").where('rr.ref_object_id': @interview_ids))
      .group('registry_entries.id, rrt.id')
      .select("registry_entries.id, rrt.id AS registry_reference_type_id, COUNT(*) AS ref_type_count")
    result
  end

  def ref_type_subquery()
    # Returns registry reference types that are relevant for the map.
    result = RegistryReferenceType
      .select('registry_reference_types.id, registry_reference_types.code, metadata_fields.ref_object_type')
      .joins(:metadata_field)
      .where(metadata_fields: {project_id: @project_id, ref_object_type: ["Person", "Interview"], use_in_map_search: true})
    result
  end

  def segment_count_subquery()
    # Returns rows like this:
    # id       ref_type_counts
    # 90408900 {"segment": 6}
    result = RegistryEntry
      .select('registry_entries.id, JSON_OBJECT("segment", COUNT(*)) AS ref_type_counts')
      .joins('INNER JOIN registry_references rr ON rr.registry_entry_id = registry_entries.id')
      .joins('INNER JOIN interviews i ON rr.interview_id = i.id')
      .where('rr.ref_object_type': 'Segment')
      .where('registry_entries.has_geo_coords': true)
      .where('i.id': @interview_ids)
    result = result.where('i.workflow_state': 'public') if @scope_is_public
    result = result.group('registry_entries.id')
    result
  end
end
