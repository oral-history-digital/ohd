require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe MetadataImport do

  before(:all) do
    Person.destroy_all
    Interview.destroy_all
    @language = FactoryBot.create(:language) #unless Language.where(name: 'Deutsch').first
    FactoryBot.create(:language, code: "pol", name: "Polnisch")

    @project = project_with_contribution_types_and_metadata_fields

    # create files with valid archive_id for @project
    #
    metadata_import_template = File.read('spec/files/metadata-import-template.csv')
    metadata_import_template = metadata_import_template.sub('mog900', "#{@project.shortname}900")
    File.write('spec/files/metadata-import-template-tmp.csv', metadata_import_template)

    metadata_update_template = File.read('spec/files/metadata-update-template.csv')
    metadata_update_template = metadata_update_template.sub('mog900', "#{@project.shortname}900")
    File.write('spec/files/metadata-update-template-tmp.csv', metadata_update_template)
  end

  after(:all) do
    File.delete('spec/files/metadata-import-template-tmp.csv')
    File.delete('spec/files/metadata-update-template-tmp.csv')
  end

  describe 'processing a file' do
    subject(:project){ @project}

    it 'should create people and metadata from file entries' do
      MetadataImport.new('spec/files/metadata-import-template-tmp.csv', project, :de).process
      expect(Person.count).to eq(5)

      expect(Interview.last.language.name).to eq("Deutsch")
      expect(Interview.last.interview_date).to eq("03/03/20")
      expect(Interview.last.media_type).to eq("video")
      expect(Interview.last.duration).to eq(9000)
      expect(Interview.last.observations).to eq("am Abend sah man die Wolken")
      expect(Interview.last.tape_count).to eq(3)
      expect(Interview.last.description).to eq("ging ganz gut")

      expect(Interview.last.interviewees.first.first_name).to eq('Maria')
      expect(Interview.last.interviewees.first.last_name).to eq('Schmid')
      expect(Interview.last.interviewees.first.birth_name).to eq('Huber')
      expect(Interview.last.interviewees.first.alias_names).to eq('Meyer')
      expect(Interview.last.interviewees.first.other_first_names).to eq('Laura')
      expect(Interview.last.interviewees.first.pseudonym_first_name).to eq('Irene')
      expect(Interview.last.interviewees.first.pseudonym_last_name).to eq('Falsch')
      expect(Interview.last.interviewees.first.use_pseudonym).to eq(true)
      expect(Interview.last.interviewees.first.description).to eq('nette alte Dame')
      expect(Interview.last.interviewees.first.date_of_birth).to eq('01/01/01')
      expect(Interview.last.interviewees.first.biographical_entries.first.text).to eq('Geboren und gestorben')
      expect(Interview.last.interviewees.first.biographical_entries.first.workflow_state).to eq('public')

      expect(Interview.last.interviewers.first.first_name).to eq('Matilda')
      expect(Interview.last.interviewers.first.last_name).to eq('Gelb')
      expect(Interview.last.transcriptors.first.first_name).to eq('Marta')
      expect(Interview.last.transcriptors.first.last_name).to eq('Rot')
      expect(Interview.last.translators.first.first_name).to eq('Uwe')
      expect(Interview.last.translators.first.last_name).to eq('Blau')
      expect(Interview.last.researches.first.first_name).to eq('Hans')
      expect(Interview.last.researches.first.last_name).to eq('Sack')

      interviewee_birth_location = Interview.last.interviewee.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'birth_location').first.registry_entry
      interview_location = Interview.last.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'interview_location').first.registry_entry

      places = project.registry_entries.where(code: 'places').first
      deutschland = places.find_descendant_by_name('Deutschland', :de) 
      berlin = deutschland.find_descendant_by_name('Berlin', :de) 
      bayern = places.find_descendant_by_name('Bayern', :de) 
      attenhofen = bayern.find_descendant_by_name('Attenhofen', :de) 

      expect(interviewee_birth_location).to eq(berlin)
      expect(interview_location).to eq(attenhofen)
      expect(places.children).to include(deutschland, bayern)
      expect(bayern.children).to include(attenhofen)
      expect(deutschland.children).to include(berlin)
    end

    it 'should update people and metadata from file entries' do
      MetadataImport.new('spec/files/metadata-update-template-tmp.csv', project, :de).process
      expect(Person.count).to eq(5)

      expect(Interview.last.language.name).to eq("Deutsch")
      expect(Interview.last.translation_language.name).to eq("English")
      expect(Interview.last.languages).to include('pl')
      expect(Interview.last.interview_date).to eq("05/03/20")
      expect(Interview.last.media_type).to eq("audio")
      expect(Interview.last.duration).to eq(9600)
      expect(Interview.last.observations).to eq("am Abend sah man die Schwalben")
      expect(Interview.last.description).to eq("ging besser")
      expect(Interview.last.tape_count).to eq(5)

      expect(Interview.last.interviewees.first.first_name).to eq('Malehne')
      expect(Interview.last.interviewees.first.last_name).to eq('Schmidt')
      expect(Interview.last.interviewees.first.birth_name).to eq('Hubertus')
      expect(Interview.last.interviewees.first.alias_names).to eq('Meier')
      expect(Interview.last.interviewees.first.other_first_names).to eq('Linda')
      expect(Interview.last.interviewees.first.pseudonym_first_name).to eq('Maria')
      expect(Interview.last.interviewees.first.pseudonym_last_name).to eq('Richtig')
      expect(Interview.last.interviewees.first.use_pseudonym).to eq(false)
      expect(Interview.last.interviewees.first.description).to eq('gemeine Frau')
      expect(Interview.last.interviewees.first.date_of_birth).to eq('01/02/01')
      expect(Interview.last.interviewees.first.biographical_entries.first.text).to eq('Geboren, gelebt und gestorben')
      expect(Interview.last.interviewees.first.biographical_entries.first.workflow_state).to eq('unshared')

      expect(Interview.last.interviewers.first.first_name).to eq('Mareike')
      expect(Interview.last.interviewers.first.last_name).to eq('Orange')
      expect(Interview.last.transcriptors.first.first_name).to eq('Mila')
      expect(Interview.last.transcriptors.first.last_name).to eq('Lila')
      expect(Interview.last.translators.first.first_name).to eq('Ulrich')
      expect(Interview.last.translators.first.last_name).to eq('Grün')
      expect(Interview.last.researches.first.first_name).to eq('Heinrich')
      expect(Interview.last.researches.first.last_name).to eq('Stein')

      interviewee_birth_location = Interview.last.interviewee.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'birth_location').first.registry_entry
      interview_location = Interview.last.registry_references.joins(:registry_reference_type).where("registry_reference_types.code = ?", 'interview_location').first.registry_entry

      places = project.registry_entries.where(code: 'places').first
      frankreich = places.find_descendant_by_name('Frankreich', :de) 
      paris = frankreich.find_descendant_by_name('Paris', :de) 
      badenwürttemberg = places.find_descendant_by_name('Baden-Württemberg', :de) 
      stuttgart = badenwürttemberg.find_descendant_by_name('Stuttgart', :de) 

      expect(interviewee_birth_location).to eq(paris)
      expect(interview_location).to eq(stuttgart)
      expect(places.children).to include(frankreich, badenwürttemberg)
      expect(badenwürttemberg.children).to include(stuttgart)
      expect(frankreich.children).to include(paris)
    end
  end

end
