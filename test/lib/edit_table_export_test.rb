require 'test_helper'

class EditTableExportTest < ActiveSupport::TestCase
  setup do
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1)
    @csv = EditTableExport.new(@interview.archive_id, :de).process
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)
    @second_row_entries = @rows[2].split(/\t/)
  end

  test 'should write a csv containing all relevant data' do
    assert_equal "Band\tTimecode\tSprecher\tTranskript (rus)\tÜbersetzung (ger)\tÜbersetzung (eng)\tHauptüberschrift (rus)\tZwischenüberschrift (rus)\tHauptüberschrift (ger)\tZwischenüberschrift (ger)\tVerknüpfungen\tAnmerkungen (rus)\tAnmerkungen (pol)\tAnmerkungen (ger)\tAnmerkungen (eng)", @rows[0]

    assert_equal "1", @first_row_entries[0]
    assert_equal "00:00:02.00", @first_row_entries[1]
    assert_equal "INT", @first_row_entries[2]
    assert_equal "Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца", @first_row_entries[3]
    assert_equal "Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez", @first_row_entries[4]
    assert_equal "", @first_row_entries[5]
    assert_equal "Вступление", @first_row_entries[6]
    assert_equal "", @first_row_entries[7]
    assert_equal "Einleitung", @first_row_entries[8]
    assert_equal "", @first_row_entries[9]
    assert_equal @interview.segments.first.registry_references.first.registry_entry_id.to_i, @first_row_entries[10].to_i
    assert_equal "Главное местонахождение — Берлин Филиал по добыче", @first_row_entries[11]
    #assert_equal "", @first_row_entries[12]
    assert_equal "Hauptsitz Berlin Filiale für die Eisenerzgewinnung in Elsass-Lothringen", @first_row_entries[13]

    assert_equal "2", @second_row_entries[0]
    assert_equal "00:02:02.00", @second_row_entries[1]
    assert_equal "AB", @second_row_entries[2]
    assert_equal "И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни", @second_row_entries[3]
    assert_equal "Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte", @second_row_entries[4]
    assert_equal "", @second_row_entries[5]
    assert_equal "", @second_row_entries[6]
    assert_equal "жизнь", @second_row_entries[7]
    assert_equal "", @second_row_entries[8]
    assert_equal "Leben", @second_row_entries[9]
    assert_equal @interview.segments.first(2).last.registry_references.map(&:registry_entry_id).join('#'), @second_row_entries[10]
    assert_equal "Построенный для размещения восточных рабочих барачный", @second_row_entries[11]
    #assert_equal "", @second_row_entries[12]
    assert_equal "Für die Unterbringung der Ostarbeiter errichtetes Barackenlager", @second_row_entries[13]
  end
end
