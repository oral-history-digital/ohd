require 'test_helper'
require 'csv'

class EditTableExportTest < ActiveSupport::TestCase
  setup do
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1)
    @csv = EditTableExport.new(@interview.archive_id, :de).process
    @rows = CSV.parse(@csv, **CSV_OPTIONS)
    @header_row_entries = @rows[0]
    @header_indices = @header_row_entries.each_with_index.to_h
    @first_row_entries = @rows[1]
    @second_row_entries = @rows[2]
  end

  test 'should write a csv containing all relevant data' do
    expected_header = @interview.edit_table_headers(:de).values

    assert_equal expected_header, @rows[0]
    assert_includes @interview.alpha3s, 'pol'
    assert_not_includes @header_row_entries, 'Anmerkungen (pol)'
    @rows.drop(1).each do |row|
      assert_equal expected_header.length, row.length, 'Every data row must match its header columns'
    end

    assert_equal "1", @first_row_entries[0]
    assert_equal "00:00:02.00", @first_row_entries[1]
    assert_equal "INT", @first_row_entries[2]
    assert_equal "Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца", @first_row_entries[3]
    assert_equal "Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez", @first_row_entries[4]
    assert_equal "Вступление", @first_row_entries[6]
    assert_nil @first_row_entries[7]
    assert_equal "Einleitung", @first_row_entries[8]
    assert_nil @first_row_entries[9]
    assert_equal @interview.segments.first.registry_references.first.registry_entry_id.to_i, @first_row_entries[10].to_i
    # Use header indices for metadata fields to avoid hardcoding column positions, which may change as fields are added/removed.
    assert_equal "Главное местонахождение — Берлин Филиал по добыче", @first_row_entries[@header_indices['Anmerkungen (rus)']]
    assert_equal "Hauptsitz Berlin Filiale für die Eisenerzgewinnung in Elsass-Lothringen", @first_row_entries[@header_indices['Anmerkungen (ger)']]

    assert_equal "2", @second_row_entries[0]
    assert_equal "00:02:02.00", @second_row_entries[1]
    assert_equal "AB", @second_row_entries[2]
    assert_equal "И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни", @second_row_entries[3]
    assert_equal "Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte", @second_row_entries[4]
    assert_nil @second_row_entries[6]
    assert_equal "жизнь", @second_row_entries[7]
    assert_nil @second_row_entries[8]
    assert_equal "Leben", @second_row_entries[9]
    assert_equal @interview.segments.first(2).last.registry_references.map(&:registry_entry_id).join('#'), @second_row_entries[10]
    # Again, use header indices for metadata fields to avoid hardcoding column positions.
    assert_equal "Построенный для размещения восточных рабочих барачный", @second_row_entries[@header_indices['Anmerkungen (rus)']]
    assert_equal "Für die Unterbringung der Ostarbeiter errichtetes Barackenlager", @second_row_entries[@header_indices['Anmerkungen (ger)']]
  end

  test 'preserves quoted annotation text while removing tabs and line breaks' do
    annotation = @interview.segments.first.annotations.first
    annotation.translations.find_by!(locale: 'ger').update!(
      text: "Berlin \"Hauptsitz\"\nFiliale\tElsass"
    )

    rows = CSV.parse(EditTableExport.new(@interview.archive_id, :de).process, **CSV_OPTIONS)

    assert_equal 'Berlin "Hauptsitz" Filiale Elsass', rows[1][rows[0].index('Anmerkungen (ger)')]
    assert_equal rows[0].length, rows[1].length
  end
end
