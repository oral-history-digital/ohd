require 'test_helper'
require 'securerandom'

class InterviewStatisticsExporterTest < ActiveSupport::TestCase
  test 'institution_counts uses collection institution and falls back to project institutions' do
    project = DataHelper.test_project(shortname: unique_shortname('isf'))

    collection_institution = Institution.create!(
      name: 'Collection Institution',
      shortname: "ci-#{SecureRandom.hex(3)}",
      country: 'de'
    )

    fallback_institution = Institution.create!(
      name: 'Fallback Institution',
      shortname: "fi-#{SecureRandom.hex(3)}",
      country: 'fr',
      projects: [project]
    )

    collection_with_institution = Collection.create!(
      name: 'Collection with institution',
      project: project,
      institution: collection_institution
    )

    collection_without_institution = Collection.create!(
      name: 'Collection without institution',
      project: project,
      institution: collection_institution
    )
    collection_without_institution.update_column(:institution_id, nil)

    interview_using_collection_institution = create_interview(
      project: project,
      collection: collection_with_institution,
      suffix: 1,
      media_type: 'video'
    )

    interview_using_fallback_institution = create_interview(
      project: project,
      collection: collection_without_institution,
      suffix: 2,
      media_type: 'audio'
    )

    exporter = InterviewStatisticsExporter.new(project: project, locale: :en)
    counts = exporter.send(
      :institution_counts,
      Interview.where(id: [interview_using_collection_institution.id, interview_using_fallback_institution.id])
    )

    assert_equal 1, counts[collection_institution.id]
    assert_equal 1, counts[fallback_institution.id]
    assert_equal 2, counts.values.sum
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
