require 'test_helper'
require 'securerandom'

class ProjectMetricsRepositoryTest < ActiveSupport::TestCase
  test 'returns counts, languages, and year ranges for projects' do
    project = DataHelper.test_project(shortname: "pm#{SecureRandom.hex(3)}a")

    institution = Institution.create!(
      name: 'Repository Institution',
      shortname: "repoinst#{SecureRandom.hex(2)}"
    )
    InstitutionProject.create!(project: project, institution: institution)

    collection = Collection.create!(
      project: project,
      institution: institution,
      name: 'Repository Collection'
    )

    contribution_type = ContributionType.create!(
      project: project,
      code: 'interviewee',
      label: 'Interviewee'
    )

    person_a = Person.create!(
      project: project,
      first_name: 'Anna',
      last_name: 'Alpha',
      date_of_birth: '1922-02-01'
    )

    person_b = Person.create!(
      project: project,
      first_name: 'Berta',
      last_name: 'Beta',
      date_of_birth: '1931-07-20'
    )

    interview_public = Interview.create!(
      project: project,
      collection: collection,
      archive_id: "#{project.shortname}001",
      media_type: 'audio',
      interview_date: '1979-1981',
      workflow_state: 'public'
    )

    interview_restricted = Interview.create!(
      project: project,
      collection: collection,
      archive_id: "#{project.shortname}002",
      media_type: 'audio',
      interview_date: '1984',
      workflow_state: 'restricted'
    )

    InterviewLanguage.create!(
      interview: interview_public,
      language: Language.find_by!(code: 'eng'),
      spec: 'primary'
    )

    InterviewLanguage.create!(
      interview: interview_restricted,
      language: Language.find_by!(code: 'eng'),
      spec: 'primary'
    )

    Contribution.create!(
      interview: interview_public,
      person: person_a,
      contribution_type: contribution_type
    )

    Contribution.create!(
      interview: interview_restricted,
      person: person_b,
      contribution_type: contribution_type
    )

    repository = ProjectMetricsRepository.new([project.id])

    interview_counts = repository.interview_counts_by_project
    collection_counts = repository.collection_counts_by_project
    languages = repository.interview_languages_by_project
    interview_ranges = repository.interview_year_ranges_by_project
    birth_ranges = repository.birth_year_ranges_by_project
    updates = repository.latest_updates_for_project(project.id)

    assert_equal 1, interview_counts[[project.id, 'public']]
    assert_equal 1, interview_counts[[project.id, 'restricted']]
    assert_equal 1, collection_counts[[project.id, 'public']]
    assert_equal ['eng'], languages[project.id]

    assert_equal 1979, interview_ranges.dig(project.id, :min)
    assert_equal 1984, interview_ranges.dig(project.id, :max)
    assert_equal 1922, birth_ranges.dig(project.id, :min)
    assert_equal 1931, birth_ranges.dig(project.id, :max)

    assert updates.key?(:interview_updated_at)
    assert updates.key?(:collection_updated_at)
    assert updates.key?(:interview_language_updated_at)
    assert updates.key?(:sponsor_updated_at)
  end
end
