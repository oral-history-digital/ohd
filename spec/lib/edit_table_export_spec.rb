require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe EditTableExport do

  before(:all) do
    @interview = interview_with_everything
    @csv = EditTableExport.new(@interview.archive_id).process
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)
    @second_row_entries = @rows[2].split(/\t/)
  end

  describe 'exporting an interview' do
    subject(:interview){@interview}
    subject(:csv){@csv}
    subject(:rows){@rows}
    subject(:first_row_entries){@first_row_entries}
    subject(:second_row_entries){@second_row_entries}

    it 'should write a csv containing all relevant data' do
      expect(rows[0]).to eq("Band\tTimecode\tSprecher\tTranskript\tÜbersetzung\tHauptüberschrift\tZwischenüberschrift\tHauptüberschrift (Übersetzung)\tZwischenüberschrift (Übersetzung)\tRegisterverknüpfungen\tAnmerkungen\tAnmerkungen (Übersetzung)")

      expect(first_row_entries[0]).to eq("1")
      expect(first_row_entries[1]).to eq("00:00:02.00")
      expect(first_row_entries[2]).to eq("INT")
      expect(first_row_entries[3]).to eq("Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца")
      expect(first_row_entries[4]).to eq("Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez")
      expect(first_row_entries[5]).to eq("Вступление")
      expect(first_row_entries[6]).to eq("")
      expect(first_row_entries[7]).to eq("Einleitung")
      expect(first_row_entries[8]).to eq("")
      expect(first_row_entries[9].to_i).to eq(interview.segments.first.registry_references.first.registry_entry_id)
      expect(first_row_entries[10]).to eq("Главное местонахождение — Берлин Филиал по добыче")
      expect(first_row_entries[11]).to eq("Hauptsitz Berlin Filiale für die Eisenerzgewinnung in Elsass-Lothringen")

      expect(second_row_entries[0]).to eq("2")
      expect(second_row_entries[1]).to eq("00:02:02.00")
      expect(second_row_entries[2]).to eq("AB")
      expect(second_row_entries[3]).to eq("И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни")
      expect(second_row_entries[4]).to eq("Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte")
      expect(second_row_entries[5]).to eq("")
      expect(second_row_entries[6]).to eq("жизнь")
      expect(second_row_entries[7]).to eq("")
      expect(second_row_entries[8]).to eq("Leben")
      expect(second_row_entries[9]).to eq(interview.segments.first(2).last.registry_references.map(&:registry_entry_id).join('#'))
      expect(second_row_entries[10]).to eq("Построенный для размещения восточных рабочих барачный")
      expect(second_row_entries[11]).to eq("Für die Unterbringung der Ostarbeiter errichtetes Barackenlager")
    end
  end

end
