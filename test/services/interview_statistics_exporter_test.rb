require 'test_helper'
require 'securerandom'

class InterviewStatisticsExporterTest < ActiveSupport::TestCase
  test 'institution_counts aggregates child-linked projects under top-level institutions' do
    project = DataHelper.test_project(shortname: unique_shortname('isf'))

    top_level_institution = Institution.create!(
      name: 'Top Level Institution',
      shortname: "ti-#{SecureRandom.hex(3)}",
      country: 'fr',
      projects: [project]
    )

    child_institution = Institution.create!(
      name: 'Child Institution',
      shortname: "chi-#{SecureRandom.hex(3)}",
      country: 'fr',
      parent: top_level_institution,
      projects: [project]
    )

    collection_institution = Institution.create!(
      name: 'Collection Institution',
      shortname: "ci-#{SecureRandom.hex(3)}",
      country: 'de'
    )

    collection_with_institution = Collection.create!(
      name: 'Collection with institution',
      project: project,
      institution: collection_institution
    )

    collection_without_institution = Collection.create!(
      name: 'Collection without institution',
      project: project,
      institution: nil
    )

    interview_one = create_interview(
      project: project,
      collection: collection_with_institution,
      suffix: 1,
      media_type: 'video'
    )

    interview_two = create_interview(
      project: project,
      collection: collection_without_institution,
      suffix: 2,
      media_type: 'audio'
    )

    fallback_project = DataHelper.test_project(shortname: unique_shortname('isg'))

    fallback_child_institution = Institution.create!(
      name: 'Fallback Child Institution',
      shortname: "fci-#{SecureRandom.hex(3)}",
      country: 'uk',
      parent: top_level_institution,
      projects: [fallback_project]
    )

    fallback_collection = Collection.create!(
      name: 'Fallback Collection',
      project: fallback_project,
      institution: nil
    )

    fallback_interview = create_interview(
      project: fallback_project,
      collection: fallback_collection,
      suffix: 3,
      media_type: 'video'
    )

    exporter = InterviewStatisticsExporter.new(project: project, locale: :en)
    counts = exporter.send(
      :institution_counts,
      Interview.where(id: [interview_one.id, interview_two.id, fallback_interview.id])
    )

    assert_equal 3, counts[top_level_institution.id]
    assert_nil counts[child_institution.id]
    assert_nil counts[fallback_child_institution.id]
    assert_nil counts[collection_institution.id]
    assert_equal 3, counts.values.sum
  end

  test 'indexing_level_counts groups by OHD indexing level registry entries' do
    ohd_project = Project.find_by!(shortname: 'ohd')

    ohd_institution = Institution.create!(
      name: 'OHD Test Institution',
      shortname: "ohd-#{SecureRandom.hex(3)}",
      country: 'de',
      projects: [ohd_project]
    )

    collection = Collection.create!(
      name: 'OHD Collection',
      project: ohd_project,
      institution: ohd_institution
    )

    interview_one = create_interview(
      project: ohd_project,
      collection: collection,
      suffix: 11,
      media_type: 'video'
    )

    interview_two = create_interview(
      project: ohd_project,
      collection: collection,
      suffix: 12,
      media_type: 'audio'
    )

    level_root = RegistryEntry.find_or_create_by!(id: 21_898_470) do |entry|
      entry.project = ohd_project
      entry.workflow_state = 'public'
    end

    level_one = RegistryEntry.create!(project: ohd_project, workflow_state: 'public')
    level_two = RegistryEntry.create!(project: ohd_project, workflow_state: 'public')

    RegistryHierarchy.find_or_create_by!(ancestor_id: level_root.id, descendant_id: level_one.id)
    RegistryHierarchy.find_or_create_by!(ancestor_id: level_root.id, descendant_id: level_two.id)

    RegistryReference.create!(
      registry_entry: level_one,
      workflow_state: 'checked',
      ref_object: interview_one,
      interview: interview_one,
      ref_position: 1
    )

    RegistryReference.create!(
      registry_entry: level_two,
      workflow_state: 'checked',
      ref_object: interview_two,
      interview: interview_two,
      ref_position: 1
    )

    exporter = InterviewStatisticsExporter.new(project: ohd_project, locale: :en)
    counts = exporter.send(
      :indexing_level_counts,
      Interview.where(id: [interview_one.id, interview_two.id]),
      [level_one.id, level_two.id]
    )

    assert_equal 1, counts[level_one.id]
    assert_equal 1, counts[level_two.id]
    assert_equal 2, counts.values.sum
  end

  test 'time_slots include full history months and years' do
    project = DataHelper.test_project(shortname: unique_shortname('isl'))
    institution = Institution.create!(
      name: 'History Institution',
      shortname: "hist-#{SecureRandom.hex(3)}",
      projects: [project]
    )
    collection = Collection.create!(
      name: 'History Collection',
      project: project,
      institution: institution
    )

    interview = create_interview(
      project: project,
      collection: collection,
      suffix: 33,
      media_type: 'video'
    )

    old_timestamp = 26.months.ago.end_of_month
    interview.update_columns(created_at: old_timestamp, updated_at: old_timestamp)

    exporter = InterviewStatisticsExporter.new(project: project, locale: :en)
    slots = exporter.send(:time_slots).map(&:first)

    assert_includes slots, old_timestamp.year
    assert_includes slots, old_timestamp.strftime('%m.%Y')
  end

  test 'month slot includes records from noon of the last day of the month' do
    project = DataHelper.test_project(shortname: unique_shortname('ism'))
    institution = Institution.create!(
      name: 'Month Boundary Institution',
      shortname: "mb-#{SecureRandom.hex(3)}",
      projects: [project]
    )
    collection = Collection.create!(
      name: 'Month Boundary Collection',
      project: project,
      institution: institution
    )

    interview = create_interview(
      project: project,
      collection: collection,
      suffix: 44,
      media_type: 'video'
    )

    month_end_noon = 1.month.ago.end_of_month.change(hour: 12, min: 0, sec: 0)
    interview.update_columns(created_at: month_end_noon, updated_at: month_end_noon)

    exporter = InterviewStatisticsExporter.new(project: project, locale: :en)
    slots = exporter.send(:time_slots)
    label = month_end_noon.strftime('%m.%Y')
    conditions = slots.find { |slot_label, _conditions| slot_label == label }&.last

    assert_not_nil conditions
    assert_equal 1, Interview.where(id: interview.id).where(conditions).count
  end

  test 'does not add indexing level header when level root is missing' do
    ohd_project = Project.find_by!(shortname: 'ohd')
    exporter = InterviewStatisticsExporter.new(project: ohd_project, locale: :en)
    original_method = RegistryEntry.method(:ohd_level_of_indexing)

    # Stub the OHD level of indexing method to return nil, simulating a missing level root.
    RegistryEntry.define_singleton_method(:ohd_level_of_indexing) { nil }

    begin
      csv = exporter.perform
      expected_header = "=== #{TranslationValue.for('modules.catalog.level_of_indexing', :en, {}, true)} ==="

      # The header should not be included since the level root is missing.
      refute_includes csv, expected_header
    ensure
      # Restore the original method to avoid side effects on other tests.
      RegistryEntry.define_singleton_method(:ohd_level_of_indexing, original_method)
    end
  end

  private

  def create_interview(project:, collection:, suffix:, media_type:)
    archive_id = "#{project.shortname}#{format('%03d', suffix)}"

    interview = Interview.create!(
      project: project,
      collection: collection,
      archive_id: archive_id,
      media_type: media_type,
      workflow_state: 'public'
    )

    english = Language.find_or_create_by!(code: 'eng') do |language|
      language.name = 'English'
    end

    InterviewLanguage.create!(
      interview: interview,
      language: english,
      spec: 'primary'
    )

    interview
  end

  def unique_shortname(prefix)
    "#{prefix}#{SecureRandom.hex(3)}a"
  end
end
