require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe MetadataImportTemplate do

  describe 'basic generation' do
    before(:all) do
      @project = Project.first || FactoryBot.create(:project)
      @csv = MetadataImportTemplate.new(@project, :de).csv
    end

    it 'should contain all base column-headers' do
      expect(@csv.parse_csv(col_sep: "\t")).to eq(["Interview-ID", "Originalsignatur", "Sprache", "Sammlung", "Interview-Datum", "Medientyp", "Dauer", "Protokoll", "Beschreibung", "Anzahl der Bänder", "Link zum Interview", "Vorname", "Nachname", "Geburtsname", "Weitere Namen", "Weitere Vornamen", "Geschlecht", "Geburtsdatum", "Biographie"])
    end
  end

  describe 'generation with registry_reference_type-metadata_fields' do
    before(:all) do
      @project = project_with_contribution_types_and_metadata_fields
      @csv = MetadataImportTemplate.new(@project, :de).csv
    end

    it 'should contain all base column-headers and columns for registry_reference_type-metadata_fields' do
      expect(@csv.parse_csv(col_sep: "\t")).to eq(["Interview-ID", "Originalsignatur", "Sprache", "Sammlung", "Interview-Datum", "Medientyp", "Dauer", "Protokoll", "Beschreibung", "Anzahl der Bänder", "Link zum Interview", "Vorname", "Nachname", "Geburtsname", "Weitere Namen", "Weitere Vornamen", "Geschlecht", "Geburtsdatum", "Biographie", "Interviewte*r", "Interviewführung", "Übersetzung", "Transkription", "Erschließung", "Geburtsort", "Geburtsort (direkter Oberbegriff)", "Interviewort", "Interviewort (direkter Oberbegriff)"])
    end
  end

end
