require 'test_helper'

# Exercises committed writes against Solr rather than only asserting queued jobs.
class SearchIndexRefreshTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper
  self.use_transactional_tests = false

  setup do
    clear_enqueued_jobs
    @projects = 2.times.map do
      DataHelper.test_project(shortname: "sr#{SecureRandom.hex(3)}a", fullname_on_landing_page: true)
    end
    @project, @other_project = @projects
    @interview = create_interview(@project)
    @other = create_interview(@other_project)
    @person = @interview.interviewee
    @extra_fields = []
    @languages = []
    drain_index_jobs
  end

  teardown do
    @extra_fields.each(&:destroy!)
    @projects.each { |project| project.reload.destroy! }
    @languages.each(&:destroy!)
    drain_index_jobs
    clear_enqueued_jobs
  end

  test 'creation indexes the completed interview and deletion removes it' do
    created = nil
    refresh { created = create_interview(@project, 2) }
    assert_includes indexed_ids(Interview, created.archive_id, :archive_id_fulltext), created.id

    refresh { created.destroy! }
    assert_not_includes indexed_ids(Interview, created.archive_id, :archive_id_fulltext), created.id
  end

  test 'jobs wait for commit, merge nested saves and discard rolled back work' do
    assert_no_enqueued_jobs(only: RefreshSearchIndexJob) do
      Interview.transaction do
        @interview.update!(media_type: 'audio')
        @interview.update!(duration: 123)
        assert_no_enqueued_jobs(only: RefreshSearchIndexJob)
        raise ActiveRecord::Rollback
      end
    end

    assert_enqueued_jobs 1, only: RefreshSearchIndexJob do
      Interview.transaction do
        @interview.reload.update!(media_type: 'audio')
        @interview.update!(duration: 123)
        assert_no_enqueued_jobs(only: RefreshSearchIndexJob)
      end
    end
    drain_index_jobs
    hit = interview_hit(@interview)
    assert_equal 123, hit.stored(:duration).to_i
  end

  test 'nonindexed attributes and timestamp-only writes do not enqueue work' do
    photo = Photo.create!(interview: @interview, caption: 'Unchangedcaption', locale: :en)
    segment = create_segment
    drain_index_jobs

    assert_no_enqueued_jobs(only: RefreshSearchIndexJob) do
      @interview.update!(include_notes_in_transcript_pdf: true)
      @interview.touch
      @person.update!(description: 'Unindexed biography note', typology: 'Unindexed category', locale: :en)
      @person.touch
      photo.update!(photographer: 'Another photographer', locale: :en)
      segment.update!(duration: 42)
    end
  end

  test 'person names and pseudonyms refresh interview text sorting and speaker documents' do
    segment = create_segment
    drain_index_jobs

    refresh { @person.update!(first_name: 'Quasarnova', last_name: 'Zetafamily', locale: :en) }
    assert_includes indexed_ids(Interview, 'Quasarnova', :person_name_en), @interview.id
    assert_not_includes indexed_ids(Interview, 'Quasarnova', :person_name_en), @other.id
    assert_includes indexed_ids(Segment, 'Quasarnova', :speaker), segment.id
    assert_includes indexed_ids(Person, 'Quasarnova', :text_en), @person.id

    refresh do
      @person.update!(use_pseudonym: true, pseudonym_first_name: 'Hiddenquasar',
        pseudonym_last_name: 'Alphafamily', locale: :en)
    end
    assert_includes indexed_ids(Interview, 'Hiddenquasar', :alias_names_en), @interview.id
    assert_includes indexed_ids(Segment, 'Hiddenquasar', :speaker), segment.id
    sort_name = interview_hit(@interview).stored(:person_name, :en)
    assert_includes sort_name, 'Alphafamily'
  end

  test 'direct translation edits refresh interview documents' do
    refresh { @person.translations.find_by!(locale: :en).update!(first_name: 'Directquasar') }
    assert_includes indexed_ids(Interview, 'Directquasar', :person_name_en), @interview.id
  end

  test 'biography text still refreshes interviews without indexing unrelated person edits' do
    entry = nil
    refresh { entry = BiographicalEntry.create!(person: @person, text: 'Biographyquasar', locale: :en) }
    assert_includes indexed_ids(Interview, 'Biographyquasar', :biography_en), @interview.id
    assert_includes indexed_ids(BiographicalEntry, 'Biographyquasar', :text_en), entry.id
    refresh { entry.update!(text: 'Revisedbiography', start_date: '1950', locale: :en) }
    assert_not_includes indexed_ids(BiographicalEntry, 'Biographyquasar', :text_en), entry.id
    assert_includes indexed_ids(BiographicalEntry, 'Revisedbiography', :text_en), entry.id
    hit = BiographicalEntry.search { fulltext('Revisedbiography', fields: :text_en) }.hits.first
    assert_equal '1950', hit.stored(:start_date)
    refresh { entry.update!(person: @other.interviewee) }
    assert_not_includes indexed_ids(Interview, 'Revisedbiography', :biography_en), @interview.id
    assert_includes indexed_ids(Interview, 'Revisedbiography', :biography_en), @other.id
    refresh { entry.destroy! }
    assert_not_includes indexed_ids(Interview, 'Biographyquasar', :biography_en), @interview.id
    assert_not_includes indexed_ids(Interview, 'Revisedbiography', :biography_en), @other.id
    assert_not_includes indexed_ids(BiographicalEntry, 'Revisedbiography', :text_en), entry.id
  end

  test 'events refresh date ranges on creation update reassignment and deletion' do
    type = EventType.create!(project: @project, code: 'birth', name: 'Birth')
    event = nil
    refresh do
      event = Event.create!(eventable: @person, event_type: type,
        start_date: '1950-01-01', end_date: '1950-12-31')
    end
    assert_includes Event.search { with(:start_date, Date.new(1950, 6, 1)) }.hits.map { |hit| hit.primary_key.to_i }, event.id
    assert_includes event_interview_ids('birth', Date.new(1950, 6, 1)), @interview.id
    assert_not_includes event_interview_ids('birth', Date.new(1950, 6, 1)), @other.id

    refresh { event.update!(start_date: '1960-01-01', end_date: '1960-12-31') }
    assert_not_includes event_interview_ids('birth', Date.new(1950, 6, 1)), @interview.id
    assert_includes event_interview_ids('birth', Date.new(1960, 6, 1)), @interview.id

    other_type = EventType.create!(project: @other_project, code: 'birth', name: 'Birth')
    refresh { event.update!(eventable: @other.interviewee, event_type: other_type) }
    assert_not_includes event_interview_ids('birth', Date.new(1960, 6, 1)), @interview.id
    assert_includes event_interview_ids('birth', Date.new(1960, 6, 1)), @other.id

    refresh { event.destroy! }
    assert_not_includes Event.search { with(:start_date, Date.new(1960, 6, 1)) }.hits.map { |hit| hit.primary_key.to_i }, event.id
    assert_not_includes event_interview_ids('birth', Date.new(1960, 6, 1)), @other.id
  end

  test 'registry names refresh own documents on direct edits reassignment and deletion' do
    entry = nil
    refresh { entry = DataHelper.registry_entry_with_names(@project, en: 'Registryquasar') }
    assert_includes indexed_ids(RegistryEntry, 'Registryquasar', :text_en), entry.id
    name = entry.registry_names.first
    refresh { name.translations.find_by!(locale: 'en').update!(descriptor: 'Renamedquasar') }
    assert_not_includes indexed_ids(RegistryEntry, 'Registryquasar', :text_en), entry.id
    assert_includes indexed_ids(RegistryEntry, 'Renamedquasar', :text_en), entry.id

    refresh { entry.update!(workflow_state: 'hidden') }
    hidden_ids = RegistryEntry.search do
      fulltext('Renamedquasar', fields: :text_en)
      with(:workflow_state, 'hidden')
    end.hits.map { |hit| hit.primary_key.to_i }
    assert_includes hidden_ids, entry.id

    destination = RegistryEntry.create!(project: @other_project, workflow_state: 'public')
    refresh { name.update!(registry_entry: destination, registry_name_type: @other_project.registry_name_types.first) }
    assert_not_includes indexed_ids(RegistryEntry, 'Renamedquasar', :text_en), entry.id
    assert_includes indexed_ids(RegistryEntry, 'Renamedquasar', :text_en), destination.id

    refresh { destination.destroy! }
    assert_not_includes indexed_ids(RegistryEntry, 'Renamedquasar', :text_en), destination.id
  end

  test 'person deletion removes its document and refreshes dependent interviews and speakers' do
    segment = create_segment
    refresh { @person.update!(first_name: 'Deletedquasar', locale: :en) }
    refresh { @person.destroy! }
    assert_not_includes indexed_ids(Person, 'Deletedquasar', :text_en), @person.id
    assert_not_includes indexed_ids(Interview, 'Deletedquasar', :person_name_en), @interview.id
    assert_not_includes indexed_ids(Segment, 'Deletedquasar', :speaker), segment.id
  end

  test 'metadata reassignment refreshes both archives' do
    field = MetadataField.create!(project: @project, source: 'Interview', name: 'media_type', use_as_facet: true)
    drain_index_jobs
    refresh { field.update!(project: @other_project) }
    assert_equal [@project.id, @other_project.id].sort, last_targets.fetch('Project').sort
    assert_not_includes facet_ids('media_type', 'video'), @interview.id
    assert_includes facet_ids('media_type', 'video'), @other.id
  end

  test 'person facet changes and registry references refresh only associated interviews' do
    MetadataField.create!(project: @project, source: 'Person', name: 'gender', use_as_facet: true)
    refresh { @person.update!(gender: 'female') }
    assert_equal [@interview.id], facet_ids('gender', 'female')

    type = RegistryReferenceType.create!(project: @project, code: 'search_place',
      registry_entry: @project.root_registry_entry)
    MetadataField.create!(project: @project, source: 'RegistryReferenceType',
      registry_reference_type: type, ref_object_type: 'Person', use_as_facet: true)
    entry = DataHelper.registry_entry_with_names(@project)
    reference = nil
    refresh do
      reference = RegistryReference.create!(interview: @interview, ref_object: @person,
        registry_entry: entry, registry_reference_type: type, workflow_state: 'checked', ref_position: 0)
    end
    assert_equal [@interview.id], facet_ids('search_place', entry.id.to_s)
    refresh { reference.destroy! }
    assert_empty facet_ids('search_place', entry.id.to_s)
  end

  test 'rolled back savepoints do not leak affected IDs into committed jobs' do
    Interview.transaction do
      @interview.update!(media_type: 'audio')
      Interview.transaction(requires_new: true) do
        @other.update!(media_type: 'audio')
        raise ActiveRecord::Rollback
      end
    end
    targets = enqueued_jobs.select { |job| job[:job] == RefreshSearchIndexJob }.last.fetch(:args).first
    assert_equal [@interview.id], targets.fetch('Interview')
  end

  test 'transcript imports enqueue one refresh for changed segments after commit' do
    tape = Tape.create!(interview: @interview, number: 1, media_id: "#{@interview.archive_id}_01_01")
    assert_enqueued_jobs 1, only: RefreshSearchIndexJob do
      ReadTranscriptFileJob.new.perform(interview: @interview, tape_id: tape.id, locale: 'ger',
        file_path: Rails.root.join('test/files/transcript_de.vtt').to_s)
    end
    targets = enqueued_jobs.select { |job| job[:job] == RefreshSearchIndexJob }.last.fetch(:args).first
    assert_equal [@interview.id], targets.fetch('Interview')
    assert_equal @interview.segments.pluck(:id).sort, targets.fetch('Segment').sort
    drain_index_jobs
  end

  test 'import batches discard rolled back savepoints and reset their context' do
    RefreshSearchIndexJob.batch do
      Interview.transaction do
        @interview.update!(media_type: 'audio')
        Interview.transaction(requires_new: true) do
          @other.update!(media_type: 'audio')
          raise ActiveRecord::Rollback
        end
      end
    end
    targets = enqueued_jobs.select { |job| job[:job] == RefreshSearchIndexJob }.last.fetch(:args).first
    assert_equal [@interview.id], targets.fetch('Interview')
    assert_nil ActiveSupport::IsolatedExecutionState[:search_index_batch]
  end

  test 'language names and assignments refresh only linked interviews' do
    language = Language.create!(code: 'qaa', name: 'Oldlanguage', locale: :en)
    @languages << language
    link = InterviewLanguage.create!(interview: @interview, language: language, spec: 'primary')
    drain_index_jobs

    refresh { language.update!(name: 'Novalanguage', locale: :en) }
    hit = interview_hit(@interview)
    assert_includes hit.stored(:language), 'Novalanguage'
    assert_equal [@interview.id], last_targets.fetch('Interview')

    refresh { link.update!(interview: @other) }
    assert_equal [@interview.id, @other.id].sort, last_targets.fetch('Interview').sort
    hit = interview_hit(@interview)
    assert_not_includes hit.stored(:language).to_s, 'Novalanguage'

    refresh { language.destroy! }
    hit = interview_hit(@other)
    assert_not_includes hit.stored(:language).to_s, 'Novalanguage'
  end

  test 'facet creation update and deletion refresh only the owning archive' do
    field = nil
    refresh do
      field = MetadataField.create!(project: @project, source: 'Interview', name: 'media_type', use_as_facet: true)
    end
    assert_equal [@project.id], last_targets.fetch('Project')
    assert_equal [@interview.id], facet_ids('media_type', 'video')

    refresh { field.update!(use_as_facet: false) }
    assert_empty facet_ids('media_type', 'video')

    refresh { field.update!(use_as_facet: true) }
    refresh { field.destroy! }
    assert_empty facet_ids('media_type', 'video')
  end

  test 'umbrella facets intentionally refresh all archives and labels do not reindex' do
    field = nil
    refresh do
      field = MetadataField.create!(project: Project.umbrella, source: 'Interview',
        name: 'duration', use_as_facet: true)
    end
    @extra_fields << field
    assert_includes facet_ids('duration', '12.0'), @interview.id
    assert_includes facet_ids('duration', '12.0'), @other.id

    assert_no_enqueued_jobs(only: RefreshSearchIndexJob) do
      field.update!(label: 'Duration label', facet_order: 99, locale: :en)
    end
  end

  test 'observation visibility configuration refreshes interview text' do
    field = MetadataField.create!(project: @project, source: 'Interview',
      name: 'observations', use_in_details_view: true)
    refresh { @interview.update!(observations: 'Observationquasar', locale: :en) }
    assert_includes indexed_ids(Interview, 'Observationquasar', :observations_en), @interview.id

    refresh { field.update!(use_in_details_view: false) }
    assert_not_includes indexed_ids(Interview, 'Observationquasar', :observations_en), @interview.id
    refresh { field.destroy! }
    assert_includes indexed_ids(Interview, 'Observationquasar', :observations_en), @interview.id
  end

  test 'photo captions refresh own and parent documents including reassignment and deletion' do
    photo = nil
    refresh { photo = Photo.create!(interview: @interview, caption: 'Photoquasar', locale: :en) }
    assert_includes indexed_ids(Photo, 'Photoquasar', :text_en), photo.id
    assert_includes indexed_ids(Interview, 'Photoquasar', :photo_captions_en), @interview.id

    refresh { photo.update!(interview: @other, caption: 'Changedquasar', locale: :en) }
    assert_not_includes indexed_ids(Interview, 'Photoquasar', :photo_captions_en), @interview.id
    assert_includes indexed_ids(Interview, 'Changedquasar', :photo_captions_en), @other.id
    assert_not_includes indexed_ids(Photo, 'Photoquasar', :text_en), photo.id

    refresh { photo.destroy! }
    assert_not_includes indexed_ids(Photo, 'Changedquasar', :text_en), photo.id
    assert_not_includes indexed_ids(Interview, 'Changedquasar', :photo_captions_en), @other.id
  end

  test 'recent segment text heading and speaker edits refresh own and parent documents' do
    segment = nil
    refresh { segment = create_segment }
    refresh { segment.update!(mainheading: 'Headingquasar', has_heading: true, locale: :eng) }
    assert_includes indexed_ids(Segment, 'Headingquasar', :mainheading_eng), segment.id
    assert_includes indexed_ids(Interview, 'Headingquasar', :headings), @interview.id

    refresh { segment.update!(text: 'Transcriptquasar', locale: :eng) }
    assert_includes indexed_ids(Segment, 'Transcriptquasar', :text_eng), segment.id
    assert_includes indexed_ids(Interview, 'Transcriptquasar', :transcript), @interview.id

    refresh { segment.update!(speaking_person: @other.interviewee) }
    assert_equal [segment.id], last_targets.fetch('Segment')

    other_tape = Tape.create!(interview: @other, number: 1, media_id: "#{@other.archive_id}_01_01")
    refresh { segment.update!(interview: @other, tape: other_tape) }
    assert_not_includes indexed_ids(Interview, 'Headingquasar', :headings), @interview.id
    assert_includes indexed_ids(Interview, 'Headingquasar', :headings), @other.id

    refresh { segment.destroy! }
    assert_not_includes indexed_ids(Segment, 'Headingquasar', :mainheading_eng), segment.id
    assert_not_includes indexed_ids(Interview, 'Headingquasar', :headings), @interview.id
    assert_not_includes indexed_ids(Interview, 'Transcriptquasar', :transcript), @interview.id
    assert_not_includes indexed_ids(Interview, 'Headingquasar', :headings), @other.id
  end

  test 'deleting an empty public heading restores its original-language fallback in Solr' do
    segment = create_segment
    segment.update!(mainheading: 'Fallbackquasar', locale: :eng)
    translation = segment.translations.find_by!(locale: 'eng-public')
    refresh { translation.update!(text: nil, mainheading: '') }
    assert_not_includes indexed_ids(Segment, 'Fallbackquasar', :mainheading_eng), segment.id
    refresh { translation.destroy! }
    assert_includes indexed_ids(Segment, 'Fallbackquasar', :mainheading_eng), segment.id
  end

  test 'annotations refresh embedded text on creation reassignment and deletion' do
    segment = create_segment
    annotation = nil
    refresh do
      annotation = Annotation.create!(segment: segment, interview: @interview,
        text: 'Annotationquasar', locale: :en)
    end
    assert_includes indexed_ids(Annotation, 'Annotationquasar', :text_en), annotation.id
    assert_includes indexed_ids(Interview, 'Annotationquasar', :annotations_en), @interview.id

    refresh { annotation.update!(interview: @other, text: 'Revisedquasar', locale: :en) }
    assert_not_includes indexed_ids(Interview, 'Annotationquasar', :annotations_en), @interview.id
    assert_includes indexed_ids(Interview, 'Revisedquasar', :annotations_en), @other.id

    refresh { annotation.destroy! }
    assert_not_includes indexed_ids(Annotation, 'Revisedquasar', :text_en), annotation.id
    assert_not_includes indexed_ids(Interview, 'Revisedquasar', :annotations_en), @other.id
  end

  test 'contribution reassignment refreshes both interviews and both people' do
    contribution = @interview.contributions.first
    old_person = contribution.person
    new_person = @other.interviewee
    refresh { contribution.update!(person: new_person) }
    assert_equal [old_person.id, new_person.id].sort, last_targets.fetch('Person').sort
    assert_equal [@interview.id], last_targets.fetch('Interview')
    assert_equal [@other.archive_id, @interview.archive_id].sort,
      Person.search { fulltext(new_person.first_name, fields: :text_en) }.hits
        .find { |hit| hit.primary_key.to_i == new_person.id }.stored(:archive_id).sort
  end

  private

  # Creates a minimal interview with an interviewee so dynamic facets are populated.
  # @param project [Project] Owning project
  # @param number [Integer] Public identifier suffix
  # @return [Interview] Persisted interview
  def create_interview(project, number = 1)
    person = Person.create!(project: project, first_name: "Person#{SecureRandom.hex(3)}",
      last_name: 'Initialfamily', locale: :en)
    type = project.contribution_types.find_or_create_by!(code: 'interviewee')
    Interview.create!(project: project, collection: Collection.create!(project: project, name: 'Search'),
      archive_id: "#{project.shortname}#{format('%03d', number)}", media_type: 'video',
      duration: 12, workflow_state: 'public',
      contributions: [Contribution.new(person: person, contribution_type: type)])
  end

  # Creates a segment with a real language-backed public translation.
  # @return [Segment] Persisted segment
  def create_segment
    tape = Tape.create!(interview: @interview, number: 1, media_id: "#{@interview.archive_id}_01_01")
    Segment.create!(interview: @interview, tape: tape, speaking_person: @person,
      timecode: '00:00:01.000', text: 'Originaltranscript', locale: :eng)
  end

  # Performs only search refresh jobs generated by the given write.
  # @yield Committed database write
  # @return [void]
  def refresh(&block)
    block.call
    @last_targets = enqueued_jobs.select { |job| job[:job] == RefreshSearchIndexJob }.last&.fetch(:args)&.first
    drain_index_jobs
  end

  # Drains pending search updates without running unrelated upload jobs.
  # @return [void]
  def drain_index_jobs
    perform_enqueued_jobs(only: RefreshSearchIndexJob)
  end

  # Reads requested IDs from the last executed search update.
  # @return [Hash] Affected document IDs
  def last_targets
    @last_targets
  end

  # Searches real Solr hits, including orphan documents that cannot load from SQL.
  # @param model [Class] Searchable model
  # @param term [String] Search text
  # @param field [Symbol] Fulltext field
  # @return [Array<Integer>] Indexed primary keys
  def indexed_ids(model, term, field)
    model.search { fulltext(term, fields: field) }.hits.map { |hit| hit.primary_key.to_i }
  end

  # Fetches stored fields from the interview document.
  # @param interview [Interview] Record to look up by public identifier
  # @return [Sunspot::Search::Hit, nil] Indexed document
  def interview_hit(interview)
    Interview.search { with(:archive_id, interview.archive_id) }.hits.first
  end

  # Queries a dynamic interview facet across archives to expose scoping mistakes.
  # @param name [String] Facet name
  # @param value [String] Facet value
  # @return [Array<Integer>] Matching indexed interviews
  def facet_ids(name, value)
    Interview.search { dynamic(:search_facets) { with(name, value) } }.hits.map { |hit| hit.primary_key.to_i }
  end

  # Queries the date ranges embedded in interview documents.
  # @param code [String] Event type code
  # @param date [Date] Date to intersect
  # @return [Array<Integer>] Matching interview IDs
  def event_interview_ids(code, date)
    Interview.search { dynamic(:events) { with(code, date) } }.hits.map { |hit| hit.primary_key.to_i }
  end
end
