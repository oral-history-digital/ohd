require 'test_helper'

class MetadataImportTest < ActiveSupport::TestCase

  setup do
    Person.destroy_all
    Interview.destroy_all
    @language = Language.find_or_create_by(code: "ger", name: "Deutsch")
    Language.find_or_create_by(code: "pol", name: "Polnisch")

    @project = DataHelper.project_with_contribution_types_and_metadata_fields

    # create files with valid archive_id for @project
    metadata_import_template = File.read('spec/files/metadata-import-template.csv')
    metadata_import_template = metadata_import_template.sub('mog900', "#{@project.shortname}900")
    File.write('spec/files/metadata-import-template-tmp.csv', metadata_import_template)

    metadata_update_template = File.read('spec/files/metadata-update-template.csv')
    metadata_update_template = metadata_update_template.sub('mog900', "#{@project.shortname}900")
    File.write('spec/files/metadata-update-template-tmp.csv', metadata_update_template)
  end

  teardown do
    File.delete('spec/files/metadata-import-template-tmp.csv')
    File.delete('spec/files/metadata-update-template-tmp.csv')
  end

  test 'processing a file should create people and metadata from file entries' do
    MetadataImport.new('spec/files/metadata-import-template-tmp.csv', @project, :de).process
    assert_equal 6, Person.count

    interview = Interview.last
    assert_equal "Deutsch", interview.language.name
    assert_equal "03/03/20", interview.interview_date
    assert_equal "video", interview.media_type
    assert_equal 9000, interview.duration
    assert_equal "am Abend sah man die Wolken", interview.observations
    assert_equal 3, interview.tape_count
    assert_equal "ging ganz gut", interview.description

    interviewee = interview.interviewees.first
    assert_equal 'Maria', interviewee.first_name
    assert_equal 'Schmid', interviewee.last_name
    assert_equal 'Huber', interviewee.birth_name
    assert_equal 'Meyer', interviewee.alias_names
    assert_equal 'Laura', interviewee.other_first_names
    assert_equal 'Irene', interviewee.pseudonym_first_name
    assert_equal 'Falsch', interviewee.pseudonym_last_name
    assert_equal true, interviewee.use_pseudonym
    assert_equal 'nette alte Dame', interviewee.description
    assert_equal '01/01/01', interviewee.date_of_birth
    assert_equal 'Geboren und gestorben', interviewee.biographical_entries.first.text
    assert_equal 'public', interviewee.biographical_entries.first.workflow_state

    assert_equal 'Matilda', interview.interviewers.first.first_name
    assert_equal 'Gelb', interview.interviewers.first.last_name
    assert_equal 'Marta', interview.transcriptors.first.first_name
    assert_equal 'Rot', interview.transcriptors.first.last_name
    assert_equal 'Uwe', interview.translators.first.first_name
    assert_equal 'Blau', interview.translators.first.last_name
    assert_equal 'Hans', interview.researchs.first.first_name
    assert_equal 'Sack', interview.researchs.first.last_name
    assert_equal 'Alfred', interview.cinematographers.first.first_name
    assert_equal 'Baum', interview.cinematographers.first.last_name

    interviewee_birth_location = interview.interviewee.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'birth_location').first.registry_entry
    interview_location = interview.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'interview_location').first.registry_entry

    places = @project.registry_entries.where(code: 'places').first
    deutschland = places.find_descendant_by_name('Deutschland', :de)
    berlin = deutschland.find_descendant_by_name('Berlin', :de)
    bayern = places.find_descendant_by_name('Bayern', :de)
    attenhofen = bayern.find_descendant_by_name('Attenhofen', :de)

    assert_equal berlin, interviewee_birth_location
    assert_equal attenhofen, interview_location
    assert_includes places.children, deutschland
    assert_includes places.children, bayern
    assert_includes bayern.children, attenhofen
    assert_includes deutschland.children, berlin
  end

  test 'processing a file should update people and metadata from file entries' do
    MetadataImport.new('spec/files/metadata-update-template-tmp.csv', @project, :de).process
    assert_equal 6, Person.count

    interview = Interview.last
    assert_equal "Deutsch", interview.language.name
    assert_equal "English", interview.primary_translation_language.name
    assert_includes interview.languages, 'pl'
    assert_equal "05/03/20", interview.interview_date
    assert_equal "audio", interview.media_type
    assert_equal 9600, interview.duration
    assert_equal "am Abend sah man die Schwalben", interview.observations
    assert_equal "ging besser", interview.description
    assert_equal 5, interview.tape_count

    interviewee = interview.interviewees.first
    assert_equal 'Malehne', interviewee.first_name
    assert_equal 'Schmidt', interviewee.last_name
    assert_equal 'Hubertus', interviewee.birth_name
    assert_equal 'Meier', interviewee.alias_names
    assert_equal 'Linda', interviewee.other_first_names
    assert_equal 'Maria', interviewee.pseudonym_first_name
    assert_equal 'Richtig', interviewee.pseudonym_last_name
    assert_equal false, interviewee.use_pseudonym
    assert_equal 'gemeine Frau', interviewee.description
    assert_equal '01/02/01', interviewee.date_of_birth
    assert_equal 'Geboren, gelebt und gestorben', interviewee.biographical_entries.first.text
    assert_equal 'unshared', interviewee.biographical_entries.first.workflow_state

    assert_equal 'Mareike', interview.interviewers.first.first_name
    assert_equal 'Orange', interview.interviewers.first.last_name
    assert_equal 'Mila', interview.transcriptors.first.first_name
    assert_equal 'Lila', interview.transcriptors.first.last_name
    assert_equal 'Ulrich', interview.translators.first.first_name
    assert_equal 'Grün', interview.translators.first.last_name
    assert_equal 'Heinrich', interview.researchs.first.first_name
    assert_equal 'Stein', interview.researchs.first.last_name
    assert_equal 'Ida', interview.cinematographers.first.first_name
    assert_equal 'Strauch', interview.cinematographers.first.last_name

    interviewee_birth_location = interview.interviewee.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'birth_location').first.registry_entry
    interview_location = interview.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'interview_location').first.registry_entry

    places = @project.registry_entries.where(code: 'places').first
    frankreich = places.find_descendant_by_name('Frankreich', :de)
    paris = frankreich.find_descendant_by_name('Paris', :de)
    badenwurttemberg = places.find_descendant_by_name('Baden-Württemberg', :de)
    stuttgart = badenwurttemberg.find_descendant_by_name('Stuttgart', :de)

    assert_equal paris, interviewee_birth_location
    assert_equal stuttgart, interview_location
    assert_includes places.children, frankreich
    assert_includes places.children, badenwurttemberg
    assert_includes badenwurttemberg.children, stuttgart
    assert_includes frankreich.children, paris
  end
end
