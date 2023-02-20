require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe EditTableImport do
  before(:all) do
    @interview = interview_with_contributions
  end

  after(:all) do
    File.delete(File.join(Rails.root, 'spec', 'files', 'edit-table-import-template.csv'))
  end

  describe 'processing a file' do
    subject(:interview){ @interview}

    it "should import edit-table correctly" do
      # create registry_entries to reference
      germany = registry_entry_with_names
      france = registry_entry_with_names({de: 'Frankreich', ru: 'Фра́нция'})
      poland = registry_entry_with_names({de: 'Polen', ru: 'По́льша'})

      # create file to import
      CSV.open(File.join(Rails.root, 'spec', 'files', 'edit-table-import-template.csv'), 'wb', csv_options = {headers: true, col_sep: "\t", row_sep: :auto, quote_char: "\x00"}) do |f|
        f << [
          'Band',
          'Timecode',
          'Sprecher',
          'Transkript',
          'Übersetzung',
          'Hauptüberschrift',
          'Zwischenüberschrift',
          'Hauptüberschrift (Übersetzung)',
          'Zwischenüberschrift (Übersetzung)',
          'Registerverknüpfungen',
          'Anmerkungen',
          'Anmerkungen (Übersetzung)'
        ]
        f << [
          1,
          "00:00:02.00",
          "INT",
          "Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца",
          "Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez",
          "Вступление",
          nil,
          "Einleitung",
          nil,
          germany.id,
          "Главное местонахождение — Берлин Филиал по добыче",
          "Hauptsitz Berlin\nFiliale für die Eisenerzgewinnung in Elsass-Lothringen",
        ]
        f << [
          2,
          "00:00:02.00",
          "AB",
          "И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни",
          "Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte",
          nil,
          "жизнь",
          nil,
          "Leben",
          [france, poland].map(&:id).join("#"),
          "Построенный для размещения восточных рабочих барачный",
          "Für die Unterbringung der Ostarbeiter errichtetes Barackenlager"
        ]
      end
      EditTableImport.new(interview.archive_id, File.join(Rails.root, 'spec', 'files', 'edit-table-import-template.csv')).process
      expect(interview.segments.count).to eq(2)
      expect(interview.segments.first.translations.count).to eq(6)
      expect(interview.segments.first.text("de-public")).to eq("Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez")
      expect(interview.segments.first.text("ru-public")).to eq("Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца")
      expect(interview.segments.first.mainheading("de-public")).to eq("Einleitung")
      expect(interview.segments.first.mainheading("ru-public")).to eq("Вступление")
      expect(interview.segments.first.registry_references.count).to eq(1)
      expect(interview.segments.first(2).last.registry_references.count).to eq(2)
      expect(interview.segments.first.registry_references.first.registry_entry.descriptor(:de)).to eq('Deutschland')
      expect(interview.segments.first.annotations.count).to eq(1)
      expect(interview.segments.first(2).last.annotations.first.text(:de)).to eq("Für die Unterbringung der Ostarbeiter errichtetes Barackenlager")
      expect(interview.tapes.first.segments.count).to eq(1)
      expect(interview.tapes.last.segments.count).to eq(1)
      expect(interview.segments.first.speaking_person).not_to be(nil)
      expect(interview.segments.last.speaking_person).not_to be(nil)
      expect(interview.segments.first.speaking_person).to be(interview.interviewers.first)
      expect(interview.segments.last.speaking_person).to be(interview.interviewees.first)
    end
  end

end
