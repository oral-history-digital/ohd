require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe MetadataExport do

  before(:all) do
    @project = project_with_contribution_types_and_metadata_fields
    @interview = interview_with_everything(project: @project)

    germany = registry_entry_with_names
    # interview-location registry_reference
    FactoryBot.create(
      :registry_reference,
      registry_entry: germany,
      interview: @interview,
      registry_reference_type_id: @project.registry_reference_types.where(code: 'interview_location').first.id,
      ref_object_id: @interview.id,
      ref_object_type: 'Interview'
    )
    # birth-location registry_reference
    FactoryBot.create(
      :registry_reference,
      registry_entry: germany,
      interview: @interview,
      registry_reference_type_id: @project.registry_reference_types.where(code: 'birth_location').first.id,
      ref_object_id: @interview.interviewee.id,
      ref_object_type: 'Person'
    )

    @csv = MetadataExport.new([@interview.archive_id], @project, :de).process
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)
    #@second_row_entries = @rows[2].split(/\t/)
  end

  describe 'exporting metadata' do
    subject(:project){@project}
    subject(:interview){@interview}
    subject(:csv){@csv}
    subject(:rows){@rows}
    subject(:first_row_entries){@first_row_entries}
    subject(:second_row_entries){@second_row_entries}
    subject(:locale){:de}

    it 'should write a csv containing all relevant data' do
      expect(rows[0]).to eq("Interview-ID\tOriginalsignatur\tSprache\tSammlung\tInterview-Datum\tMedientyp\tDauer\tProtokoll\tBeschreibung\tAnzahl der Bänder\tLink zum Interview\tVorname\tNachname\tGeburtsname\tWeitere Namen\tWeitere Vornamen\tGeschlecht\tGeburtsdatum\tBiographie\tInterviewführung\tTranskription\tÜbersetzung\tErschließung\tGeburtsort\tGeburtsort (direkter Oberbegriff)\tInterviewort\tInterviewort (direkter Oberbegriff)")

      expect(first_row_entries[0]).to eq(interview.archive_id)
      expect(first_row_entries[1]).to eq(interview.signature_original.to_s)
      expect(first_row_entries[2]).to eq(interview.language.name(:de))
      expect(first_row_entries[3]).to eq(interview.collection.name(locale))
      expect(first_row_entries[4]).to eq(interview.interview_date)
      expect(first_row_entries[5]).to eq(interview.media_type)
      expect(first_row_entries[6]).to eq(Timecode.new(interview.duration).timecode)
      expect(first_row_entries[7]).to eq(interview.observations(locale))
      expect(first_row_entries[8]).to eq(interview.description(locale))
      expect(first_row_entries[9]).to eq(interview.tape_count.to_s)
      expect(first_row_entries[10]).to eq(interview.properties[:link])
      expect(first_row_entries[11]).to eq(interview.interviewee.first_name)
      expect(first_row_entries[12]).to eq(interview.interviewee.last_name)
      expect(first_row_entries[13]).to eq(interview.interviewee.birth_name)
      expect(first_row_entries[14]).to eq(interview.interviewee.alias_names)
      expect(first_row_entries[15]).to eq(interview.interviewee.other_first_names)
      expect(first_row_entries[16]).to eq(interview.interviewee.pseudonym_first_name)
      expect(first_row_entries[17]).to eq(interview.interviewee.pseudonym_last_name)
      expect(first_row_entries[18]).to eq(interview.interviewee.use_pseudonym)
      expect(first_row_entries[19]).to eq(interview.interviewee.description(locale))
      expect(first_row_entries[20]).to eq(interview.interviewee.gender)
      expect(first_row_entries[21]).to eq(interview.interviewee.date_of_birth)
      expect(first_row_entries[22]).to eq(interview.interviewee.biography(locale))
      expect(first_row_entries[23]).to eq(interview.interviewee.biography_public?)
      expect(first_row_entries[24]).to eq(interview.interviewers.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#').to_s)
      expect(first_row_entries[25]).to eq(interview.transcriptors.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#').to_s)
      expect(first_row_entries[26]).to eq(interview.translators.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#').to_s)
      expect(first_row_entries[27]).to eq(interview.researches.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#').to_s)
      expect(first_row_entries[28]).to eq("Deutschland")
      expect(first_row_entries[29]).to eq("Deutschland")


      #expect(first_row_entries[0]).to eq("1")
      #expect(first_row_entries[1]).to eq("00:00:02.00")
      #expect(first_row_entries[2]).to eq("INT")
      #expect(first_row_entries[3]).to eq("Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца")
      #expect(first_row_entries[4]).to eq("Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez")
      #expect(first_row_entries[5]).to eq("Вступление")
      #expect(first_row_entries[6]).to eq("")
      #expect(first_row_entries[7]).to eq("Einleitung")
      #expect(first_row_entries[8]).to eq("")
      #expect(first_row_entries[9].to_i).to eq(interview.segments.first.registry_references.first.registry_entry_id)
      #expect(first_row_entries[10]).to eq("Главное местонахождение — Берлин Филиал по добыче")
      #expect(first_row_entries[11]).to eq("Hauptsitz Berlin Filiale für die Eisenerzgewinnung in Elsass-Lothringen")

      #expect(second_row_entries[0]).to eq("2")
      #expect(second_row_entries[1]).to eq("00:02:02.00")
      #expect(second_row_entries[2]).to eq("AB")
      #expect(second_row_entries[3]).to eq("И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни")
      #expect(second_row_entries[4]).to eq("Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte")
      #expect(second_row_entries[5]).to eq("")
      #expect(second_row_entries[6]).to eq("жизнь")
      #expect(second_row_entries[7]).to eq("")
      #expect(second_row_entries[8]).to eq("Leben")
      #expect(second_row_entries[9]).to eq(interview.segments.first(2).last.registry_references.map(&:registry_entry_id).join('#'))
      #expect(second_row_entries[10]).to eq("Построенный для размещения восточных рабочих барачный")
      #expect(second_row_entries[11]).to eq("Für die Unterbringung der Ostarbeiter errichtetes Barackenlager")
    end
  end

end
