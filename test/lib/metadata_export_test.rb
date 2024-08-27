require 'test_helper'

class MetadataExportTest < ActiveSupport::TestCase
  setup do
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1)

    germany = DataHelper.registry_entry_with_names(@project)

    # interview-location registry_reference
    RegistryReference.create(
      registry_entry: germany,
      interview: @interview,
      registry_reference_type_id: @project.registry_reference_types.where(code: 'interview_location').first.id,
      ref_object_id: @interview.id,
      ref_object_type: 'Interview',
      ref_position: 0,
      workflow_state: 'checked'
    )

    # birth-location registry_reference
    RegistryReference.create(
      registry_entry: germany,
      interview: @interview,
      registry_reference_type_id: @project.registry_reference_types.where(code: 'birth_location').first.id,
      ref_object_id: @interview.interviewee.id,
      ref_object_type: 'Person',
      ref_position: 0,
      workflow_state: 'checked'
    )

    @csv = MetadataExport.new([@interview.archive_id], @project, :de).process
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)
  end

  test 'should write a csv containing all relevant data' do
    assert_equal "Interview-ID\tOriginalsignatur\tErste Sprache\tZweite Sprache\tErste Übersetzungssprache\tSammlung\tInterview-Datum\tMedientyp\tDauer\tProtokoll\tBeschreibung\tAnzahl der Bänder\tLink zum Interview\tVorname\tNachname\tGeburtsname\tWeitere Namen\tWeitere Vornamen\tPseudonym Vorname\tPseudonym Nachname\tPseudonym benutzen\tPersonenbeschreibung\tGeschlecht\tGeburtsdatum\tBiographie\tBiographie öffentlich\tInterviewführung\tÜbersetzung\tTranskription\tErschließung\tKamera\tGeburtsort\tGeburtsort (direkter Oberbegriff)\tInterviewort\tInterviewort (direkter Oberbegriff)", @rows[0]

    assert_equal @interview.archive_id, @first_row_entries[0]
    assert_equal @interview.signature_original.to_s, @first_row_entries[1]
    assert_equal @interview.language.name(:de), @first_row_entries[2]
    assert_equal @interview.secondary_language.name(:de), @first_row_entries[3]
    assert_equal @interview.primary_translation_language.name(:de), @first_row_entries[4]
    assert_equal @interview.collection.name(:de), @first_row_entries[5]
    assert_equal @interview.interview_date.to_s, @first_row_entries[6]
    assert_equal @interview.media_type, @first_row_entries[7]
    assert_equal Timecode.new(@interview.duration).timecode, @first_row_entries[8]
    assert_equal @interview.observations(:de), @first_row_entries[9]
    assert_equal @interview.description(:de), @first_row_entries[10]
    assert_equal @interview.tape_count.to_s, @first_row_entries[11]
    assert_equal @interview.properties[:link], @first_row_entries[12]
    assert_equal @interview.interviewee.first_name, @first_row_entries[13]
    assert_equal @interview.interviewee.last_name, @first_row_entries[14]
    assert_equal @interview.interviewee.birth_name, @first_row_entries[15]
    assert_equal @interview.interviewee.alias_names, @first_row_entries[16]
    assert_equal @interview.interviewee.other_first_names, @first_row_entries[17]
    assert_equal @interview.interviewee.pseudonym_first_name, @first_row_entries[18]
    assert_equal @interview.interviewee.pseudonym_last_name, @first_row_entries[19]
    assert_equal @interview.interviewee.use_pseudonym.to_s, @first_row_entries[20]
    assert_equal @interview.interviewee.description(:de), @first_row_entries[21]
    assert_equal @interview.interviewee.gender, @first_row_entries[22]
    assert_equal @interview.interviewee.date_of_birth.to_s, @first_row_entries[23]
    assert_equal @interview.interviewee.biography(:de), @first_row_entries[24]
    assert_equal @interview.interviewee.biography_public?.to_s, @first_row_entries[25]
    assert_equal @interview.interviewers.map { |c| "#{c.last_name}, #{c.first_name}" }.join('#').to_s, @first_row_entries[26]
    assert_equal @interview.translators.map { |c| "#{c.last_name}, #{c.first_name}" }.join('#').to_s, @first_row_entries[27]
    assert_equal @interview.transcriptors.map { |c| "#{c.last_name}, #{c.first_name}" }.join('#').to_s, @first_row_entries[28]
    assert_equal @interview.researchs.map { |c| "#{c.last_name}, #{c.first_name}" }.join('#').to_s, @first_row_entries[29]
    assert_equal @interview.cinematographers.map { |c| "#{c.last_name}, #{c.first_name}" }.join('#').to_s, @first_row_entries[30]
    assert_equal "Deutschland", @first_row_entries[31]
    assert_equal "Deutschland", @first_row_entries[33]
  end
end

