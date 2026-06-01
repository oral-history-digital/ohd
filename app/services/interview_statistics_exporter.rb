class InterviewStatisticsExporter < ApplicationService
  require 'csv'

  def initialize(project:, locale: I18n.locale)
    @project = project
    @locale = locale
    # Use project's live date if available, otherwise fall back to project creation date.
    @live_since = project.live_since || project.created_at

    # Base interview relation used throughout the exporter.
    # This is an ActiveRecord relation, not an array, so additional where/group/count
    # clauses can be chained onto it later.
    @interviews = base_interviews
  end

  def perform
    # Time slots define the CSV columns after the first label column.
    # Each slot has this shape:
    #
    #   [display_name, sql_conditions]
    #
    # Example:
    #
    #   ["05.2026", ["interviews.created_at > ? AND interviews.created_at <= ?", start_date, end_date]]
    #
    slots = time_slots

    # Generate and return the CSV as a string.
    CSV.generate(**CSV_OPTIONS) do |csv|
      # First row:
      # - first cell: translated report header
      # - following cells: names of the time slots, for example Total, 2024, 2025, 01.2026
      csv << [
        translate('interview_statistics.header', date: Time.current.strftime('%d.%m.%Y')),
      ] + slots.map(&:first)

      # Second row:
      # - first cell is empty
      # - following cells contain total interview counts for each time slot
      csv << [nil] + slots.map { |(_, conditions)| @interviews.where(conditions).count }

      # Add grouped sections to the CSV.
      # Each section adds a header row and then rows with counts per time slot.
      add_workflow_state_section(csv, slots)
      add_project_section(csv, slots)
      add_institution_section(csv, slots)
      add_institution_country_section(csv, slots)
      add_language_section(csv, slots)
      add_media_type_section(csv, slots)

      # For OHD projects, this section includes counts by level of indexing registry entry.
      if @project.is_ohd?
        add_indexing_level_section(csv, slots)
      end
    end
  end

  private

  def base_interviews
    # For the OHD project, the report includes interviews from all projects.
    # For all other projects, only interviews belonging to the current project are included.
    if @project.is_ohd?
      Interview.all
    else
      Interview.where(project_id: @project.id)
    end
  end

  def add_workflow_state_section(csv, slots)
    # Count interviews by workflow_state, for example public/restricted/unshared.
    # Result shape before sorting:
    #
    #   { "public" => 100, "restricted" => 20, "unshared" => 5 }
    #
    groups = @interviews.group(:workflow_state).count.sort_by { |_state, count| -count }

    add_simple_group_section(csv, slots, 'workflow_state', groups, group_by: :workflow_state) do |state|
      [
        label_for_workflow(state),
        state
      ]
    end
  end

  def add_project_section(csv, slots)
    # Count interviews by project.
    #
    # The grouping includes both project ID and shortname:
    # - ID is used later for filtering.
    # - shortname is used as the CSV row label.
    groups = @interviews
      .joins(:project)
      .group('projects.id', 'projects.shortname')
      .count

    sorted_groups = groups.sort_by { |_group, count| -count }

    # Load project records once so that translated names can be fetched efficiently.
    projects = Project
      .where(id: sorted_groups.map { |((project_id, _shortname), _count)| project_id })
      .includes(:translations)
      .index_by(&:id)

    add_simple_group_section(csv, slots, 'project', sorted_groups, group_by: :project_id) do |(project_id, shortname)|
      project_name = projects[project_id]&.name(@locale)
      label = project_name.present? ? "#{project_name} (#{shortname})" : shortname

      [
        label,
        project_id
      ]
    end
  end

  def add_institution_section(csv, slots)
    # Count interviews by institution.
    #
    # institution_counts handles two cases:
    # 1. The interview's collection has an institution.
    # 2. The interview's collection has no institution, so the project's institutions are used.
    rows = institution_counts(@interviews).sort_by { |_institution_id, count| -count }

    # Load institution records once so that translated names can be fetched efficiently.
    institutions = Institution
      .where(id: rows.map(&:first))
      .includes(:translations)
      .index_by(&:id)

    add_section_header(csv, 'institution')

    # Compute institution counts once per time slot to avoid per-cell queries.
    slot_counts = slots.map do |(_name, conditions)|
      institution_counts(@interviews.where(conditions))
    end

    rows.each do |institution_id, _count|
      institution = institutions[institution_id]

      # Use the translated institution name if available.
      # If no institution record is found, use a translated "not specified" label.
      label = institution ? institution.name(@locale) : not_specified_label(translate(section_translation_key_for('institution')))

      # For each time slot, calculate the institution counts for interviews in that slot,
      # then pick the count for the current institution.
      csv << [label] + slot_counts.map do |counts|
        counts[institution_id] || 0
      end
    end
  end

  def add_institution_country_section(csv, slots)
    # Count interviews by institution country.
    #
    # Like institution_counts, this considers:
    # 1. Collection institution country.
    # 2. Project institution country when the collection has no institution.
    rows = institution_country_counts(@interviews).sort_by { |_country, count| -count }

    add_section_header(csv, 'institution_country')

    # Compute country counts once per time slot to avoid per-cell queries.
    slot_counts = slots.map do |(_name, conditions)|
      institution_country_counts(@interviews.where(conditions))
    end

    rows.each do |country, _count|
      # country_label translates the country value, or returns a "not specified" label
      csv << [country_label(country)] + slot_counts.map do |counts|
        counts[country] || 0
      end
    end
  end

  def add_language_section(csv, slots)
    # Count interviews by language.
    # Only primary and secondary language specs are considered.
    groups = language_counts(@interviews).sort_by { |_language_id, count| -count }

    # Load language records once so that translated names can be fetched efficiently.
    languages = Language
      .where(id: groups.map(&:first))
      .includes(:translations)
      .index_by(&:id)

    add_section_header(csv, 'language')

    # Compute language counts once per time slot to avoid per-cell queries.
    slot_counts = slots.map do |(_name, conditions)|
      language_counts(@interviews.where(conditions))
    end

    groups.each do |language_id, _count|
      language = languages[language_id]

      # Use translated language name or else translated "not specified" label.
      label = language ? language.name(@locale) : not_specified_label(translate(section_translation_key_for('language')))

      # For each time slot, calculate language counts and select the current language.
      csv << [label] + slot_counts.map do |counts|
        counts[language_id] || 0
      end
    end
  end

  def add_media_type_section(csv, slots)
    # Count interviews by media_type, for example audio/video.
    groups = @interviews.group(:media_type).count.sort_by { |_media_type, count| -count }

    add_simple_group_section(csv, slots, 'media_type', groups, group_by: :media_type) do |media_type|
      [
        label_for_media_type(media_type),
        media_type
      ]
    end
  end

  def add_indexing_level_section(csv, slots)
    add_section_header(csv, 'indexing_level')

    # Find the registry root entry that represents "level of indexing".
    level_root = RegistryEntry.ohd_level_of_indexing

    # Indexing level statistics are only relevant for OHD projects.
    return unless @project.is_ohd? && level_root

    # Get all child registry entries under the "level of indexing" root.
    level_ids = level_root.children.pluck(:id)

    # Count interviews by indexing-level registry entry.
    grouped = indexing_level_counts(@interviews, level_ids).sort_by { |_entry_id, count| -count }

    # Load the registry entries so their translated labels can be used.
    registry_entries = RegistryEntry.where(id: grouped.map(&:first)).index_by(&:id)

    # Compute indexing-level counts once per time slot to avoid per-cell queries.
    slot_counts = slots.map do |(_name, conditions)|
      indexing_level_counts(@interviews.where(conditions), level_ids)
    end

    grouped.each do |entry_id, _count|
      registry_entry = registry_entries[entry_id]

      # Use the translated registry entry label or else a translated "not specified".
      label = registry_entry&.to_s(@locale) || not_specified_label(translate('modules.catalog.level_of_indexing'))

      # For each time slot, count interviews assigned to this indexing level.
      csv << [label] + slot_counts.map do |counts|
        counts[entry_id] || 0
      end
    end
  end

  def add_simple_group_section(csv, slots, section_key, groups, group_by:)
    # Adds a section for simple grouped fields.
    #
    # Used by:
    # - workflow_state
    # - project
    # - media_type
    #
    # groups is an array of:
    #
    #   [group_value, total_count]
    #
    # total_count is used only for row ordering (prepared by the caller).
    # Cell values are computed from per-slot grouped counts below.
    #
    # The caller provides a block that converts each group value into:
    #
    #   [label, group_value]
    #
    # Example:
    #
    #   ["Published", "public"]
    #
    add_section_header(csv, section_key)

    # Compute grouped counts once per time slot.
    slot_counts = slots.map do |(_name, conditions)|
      @interviews.where(conditions).group(group_by).count
    end

    groups.each do |group, _count|
      label, group_value = yield(group)

      # For each time slot, pick the count for the current group from precomputed hashes.
      csv << [label] + slot_counts.map do |counts|
        counts[group_value] || 0
      end
    end
  end

  def add_section_header(csv, section_key)
    # Adds a visual separator row for a section.
    #
    # Example output:
    #
    #   === State ===
    #
    # The section title itself is translated.
    csv << ["=== #{translate(section_translation_key_for(section_key))} ==="]
  end

  def section_translation_key_for(section_key)
    {
      'workflow_state' => 'metadata_labels.workflow_state',
      'project' => 'activerecord.models.project.one',
      'institution' => 'activerecord.models.institution.one',
      'institution_country' => 'activerecord.attributes.default.country',
      'language' => 'activerecord.attributes.interview.language',
      'media_type' => 'activerecord.attributes.interview.media_type',
      'indexing_level' => 'modules.catalog.level_of_indexing'
    }.fetch(section_key.to_s)
  end

  def language_counts(relation)
    # Counts distinct interviews by language.
    relation
      .joins(interview_languages: :language) # Connect interviews to their languages
      .where(interview_languages: { spec: %w(primary secondary).freeze }) # Only consider primary and secondary language specs
      .group('languages.id')
      .count('DISTINCT interviews.id')
  end

  def institution_counts(relation)
    # Returns a hash of:
    #
    #   { institution_id => interview_count }
    #
    # It combines two institution lookup strategies:
    #
    # 1. Interview -> Collection -> Institution
    # 2. Interview -> Project -> Institutions,
    #    but only when the collection itself has no institution.
    counts = Hash.new(0)

    # Case 1: Count interviews whose collection has an institution.
    relation
      .joins(collection: :institution)
      .group('institutions.id')
      .count('DISTINCT interviews.id')
      .each { |institution_id, count| counts[institution_id] += count }

    # Case 2: If collection has no institution, count interviews under the institutions connected to its project.
    relation
      .joins(:collection)
      .where(collections: { institution_id: nil })
      .joins(project: :institutions)
      .group('institutions.id')
      .count('DISTINCT interviews.id')
      .each { |institution_id, count| counts[institution_id] += count }

    counts
  end

  def institution_country_counts(relation)
    # Returns a hash of:
    #
    #   { country => interview_count }
    #
    # It uses the same fallback logic as institution_counts, but groups by
    # institution country instead of institution ID.
    counts = Hash.new(0)

    # Case 1: Count by country of the collection's institution.
    relation
      .joins(collection: :institution)
      .group('institutions.country')
      .count('DISTINCT interviews.id')
      .each { |country, count| counts[country] += count }

    # Case 2: If collection has no institution, count by country of the project's institutions.
    relation
      .joins(:collection)
      .where(collections: { institution_id: nil })
      .joins(project: :institutions)
      .group('institutions.country')
      .count('DISTINCT interviews.id')
      .each { |country, count| counts[country] += count }

    counts
  end

  def indexing_level_counts(relation, level_ids)
    # Counts distinct interviews by indexing-level registry entry.
    relation
      .joins(:registry_references)
      .where(registry_references: {
        registry_entry_id: level_ids,
        ref_object_type: 'Interview'.freeze
      })
      .group('registry_references.registry_entry_id')
      .count('DISTINCT interviews.id')
  end

  def label_for_workflow(value)
    # If the workflow state is blank/nil, display a translated "not specified" label.
    return not_specified_label(translate(section_translation_key_for('workflow_state'))) if value.blank?

    # Otherwise translate the workflow state value.
    translate("workflow_states.#{value}")
  end

  def label_for_media_type(value)
    # If the media type is blank/nil, display a translated "not specified" label.
    return not_specified_label(translate(section_translation_key_for('media_type'))) if value.blank?

    # Otherwise translate the media type value.
    translate("search_facets.#{value}")
  end

  def country_label(value)
    # If the country is blank/nil, display a translated "not specified" label.
    return not_specified_label(translate(section_translation_key_for('institution_country'))) if value.blank?

    # Otherwise translate the country value.
    translate("countries.#{value}")
  end

  def not_specified_label(category_label)
    # Builds labels like:
    #
    #   Not specified (Language)
    #   Not specified (Institution)
    #
    "#{translate('interview_statistics.not_specified')} (#{category_label})"
  end

  def translate(key, params = {})
    # Central translation helper for this exporter.
    TranslationValue.for(key, @locale, params, true)
  end

  def time_slots
    # All time-based report columns are based on interview creation date.
    date_attribute = 'interviews.created_at'

    # Determine the first date that should appear in year/month columns.
    start_date = reporting_start_date

    # The final slot list is:
    # 1. Total column
    # 2. One column per year
    # 3. One column per month
    #
    # Each slot has the structure:
    #
    #   [label, conditions]
    #
    (
      total(date_attribute) +
      years(start_date, date_attribute) +
      months(start_date, date_attribute)
    )
  end

  def reporting_start_date
    # Start reporting from the earliest of:
    #
    # 1. project live date / project creation date
    # 2. first interview creation date
    #
    # compact removes nil values before calling min.
    [@live_since, @interviews.minimum(:created_at)].compact.min
  end

  def total(date_attribute)
    # Create the "Total" time slot.
    [[
      translate('interview_statistics.total'),
      [
        "#{date_attribute} <= ?",
        Time.current
      ]
    ]]
  end

  def years(start_date, date_attribute)
    # Create one time slot per year from the reporting start year through the current year.
    #
    # Example:
    #
    #   [
    #     2025,
    #     ["interviews.created_at > ? AND interviews.created_at <= ?", 2024-12-31, 2025-12-31]
    #   ]
    (start_date.year..Time.current.year).inject([]) do |mem, year|
      mem << [
        year,
        [
          "#{date_attribute} > ? AND #{date_attribute} <= ?",
          Date.parse("31.12.#{year - 1}"),
          Date.parse("31.12.#{year}")
        ]
      ]
      mem
    end
  end

  def months(start_date, date_attribute)
    current = Time.current

    # Number of months between the reporting start month and current month.
    month_span = ((current.year * 12) + current.month) - ((start_date.year * 12) + start_date.month)

    # Create one slot per month.
    #
    # The reverse call ensures the output is chronological:
    # oldest month first, current month last.
    (0..month_span).to_a.reverse.inject([]) do |mem, month_offset|
      mem << [
        # Month label, for example "05.2026".
        (current - month_offset.months).strftime('%m.%Y'),

        # Date condition for the month.
        #
        # Example for May 2026:
        #
        #   created_at > 2026-04-30
        #   created_at <= 2026-05-31
        #
        [
          "#{date_attribute} > ? AND #{date_attribute} <= ?",
          (current - (month_offset + 1).months).end_of_month.to_date,
          (current - month_offset.months).end_of_month.to_date
        ]
      ]

      mem
    end
  end
end