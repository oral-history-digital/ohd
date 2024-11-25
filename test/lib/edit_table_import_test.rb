require 'test_helper'
require 'csv'

class EditTableImportTest < ActiveSupport::TestCase
  setup do
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1, false)
  end

  teardown do
    File.delete(File.join(Rails.root, 'test', 'files', 'edit-table-import-template.csv'))
  end

  test 'should import edit-table correctly' do
    # create registry_entries to reference
    germany = DataHelper.registry_entry_with_names(@project)
    france = DataHelper.registry_entry_with_names(@project, { de: 'Frankreich', ru: 'Фра́нция' })
    poland = DataHelper.registry_entry_with_names(@project, { de: 'Polen', ru: 'По́льша' })

    # create file to import
    CSV.open(
      File.join(Rails.root, 'test', 'files', 'edit-table-import-template.csv'),
      'wb',
      **CSV_OPTIONS.merge(headers: true)
    ) do |f|
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
        "Hauptsitz Berlin\nFiliale für die Eisenerzgewinnung in Elsass-Lothringen"
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

    EditTableImport.new(@interview.archive_id, File.join(Rails.root, 'test', 'files', 'edit-table-import-template.csv')).process

    assert_equal 2, @interview.segments.count
    #assert_equal 6, @interview.segments.first.translations.count # there is still one translation too much (don't knoehow to fix)
    assert_equal "Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez", @interview.segments.first.text("ger-public")
    assert_equal "Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца", @interview.segments.first.text("rus-public")
    assert_equal "Einleitung", @interview.segments.first.mainheading("ger-public")
    assert_equal "Вступление", @interview.segments.first.mainheading("rus-public")
    assert_equal 1, @interview.segments.first.registry_references.count
    assert_equal 2, @interview.segments.first(2).last.registry_references.count
    assert_equal 'Deutschland', @interview.segments.first.registry_references.first.registry_entry.descriptor(:de)
    assert_equal 1, @interview.segments.first.annotations.count
    assert_equal "Für die Unterbringung der Ostarbeiter errichtetes Barackenlager", @interview.segments.first(2).last.annotations.first.text(:de)
    assert_equal 1, @interview.tapes.first.segments.count
    assert_equal 1, @interview.tapes.last.segments.count
    assert_not_nil @interview.segments.first.speaking_person
    assert_not_nil @interview.segments.last.speaking_person
    assert_equal @interview.interviewers.first, @interview.segments.first.speaking_person
    assert_equal @interview.interviewees.first, @interview.segments.last.speaking_person
  end
end
