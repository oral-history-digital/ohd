require 'test_helper'

class MetadataImportTemplateTest < ActiveSupport::TestCase

    #assert_equal "Interview-ID\tOriginalsignatur\tErste Sprache\tZweite Sprache\tErste Übersetzungssprache\tSammlung\tInterview-Datum\tMedientyp\tDauer\tProtokoll\tBeschreibung\tAnzahl der Bänder\tLink zum Interview\tVorname\tNachname\tGeburtsname\tWeitere Namen\tWeitere Vornamen\tPseudonym Vorname\tPseudonym Nachname\tPseudonym benutzen\tPersonenbeschreibung\tGeschlecht\tGeburtsdatum\tBiographie\tBiographie öffentlich\tInterviewführung\tÜbersetzung\tTranskription\tErschließung\tKamera\tGeburtsort\tGeburtsort (direkter Oberbegriff)\tInterviewort\tInterviewort (direkter Oberbegriff)", @rows[0]

  test 'basic generation should contain all base column-headers' do
    @project = DataHelper.test_project(shortname: 'mdt')
    @csv = MetadataImportTemplate.new(@project, :de).csv
    expected_headers = [
      "true",
      "Interview-ID", "Originalsignatur", "Sprache",
      "Zweite Sprache", "Erste Übersetzungssprache", "Sammlung", 
      "Interview-Datum", "Medientyp", "Dauer", "Protokoll", 
      "Beschreibung (Interview)", "Anzahl der Bänder", "Link zum Interview", 
      "Vorname", "Nachname", "Geburtsname", "Weitere Namen", 
      "Weitere Vornamen", "Pseudonym Vorname", "Pseudonym Nachname", 
      "Pseudonym benutzen", "Personenbeschreibung", "Geschlecht", 
      "Geburtsdatum", "Biographie", "Biographie öffentlich",
      #"Interviewführung", "Übersetzung", "Transkription", "Erschließung", "Kamera"
    ]
    assert_equal expected_headers, @csv.parse_csv(col_sep: "\t")
  end

  test 'should contain all base column-headers and columns for registry_reference_type-metadata_fields' do
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @csv = MetadataImportTemplate.new(@project, :de).csv
    expected_headers = [
      "true",
      "Interview-ID", "Originalsignatur", "Sprache",
      "Zweite Sprache", "Erste Übersetzungssprache", "Sammlung", 
      "Interview-Datum", "Medientyp", "Dauer", "Protokoll", 
      "Beschreibung (Interview)", "Anzahl der Bänder", "Link zum Interview", 
      "Vorname", "Nachname", "Geburtsname", "Weitere Namen", 
      "Weitere Vornamen", "Pseudonym Vorname", "Pseudonym Nachname", 
      "Pseudonym benutzen", "Personenbeschreibung", "Geschlecht", 
      "Geburtsdatum", "Biographie", "Biographie öffentlich", 
      "Interviewführung", "Übersetzung", "Transkription", 
      "Erschließung", "Kamera", "Geburtsort", "Geburtsort (direkter Oberbegriff)", 
      "Interviewort", "Interviewort (direkter Oberbegriff)"
    ]
    assert_equal expected_headers, @csv.parse_csv(col_sep: "\t")
  end

end

