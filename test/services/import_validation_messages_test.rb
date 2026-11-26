require 'test_helper'

class ImportValidationMessagesTest < ActiveSupport::TestCase
  setup do
    {
      'test.message' => { en: 'Check the timestamp.', de: 'Zeitstempel prüfen.' },
      'test.frames' => { en: 'Frame limit: %{max} at %{rate} fps.' },
      'location.row' => { en: 'Row %{value}', de: 'Zeile %{value}' },
      'field.timecode' => { en: 'Timecode', de: 'Zeitstempel' },
      'empty_value' => { en: '(empty)' },
      'value_message' => { en: '%{field} %{value}. %{message}', de: '%{field} %{value}. %{message}' },
      'located_message' => { en: '%{location}: %{message}', de: '%{location}: %{message}' }
    }.each do |code, translations|
      TranslationValue.create_or_update_for_key("import_validation.#{code}", translations)
    end
  end

  test 'renders codes and source locations in the recipient language without changing issues' do
    issues = [ImportValidation.issue(
      'test.message',
      params: { value: '00:61:00.000' },
      location: { row: 4, field: 'timecode' }
    )]
    original = issues.deep_dup

    assert_equal 'Row 4: Timecode "00:61:00.000". Check the timestamp.',
                 ImportValidationMessages.render(issues, :en)
    assert_equal 'Zeile 4: Zeitstempel "00:61:00.000". Zeitstempel prüfen.',
                 ImportValidationMessages.render(issues, :de)
    assert_equal ImportValidationMessages.render(issues, :en), ImportValidationMessages.render(issues, :fr)
    assert_equal original, issues
    assert_equal issues, JSON.parse(issues.to_json, symbolize_names: true)
  end

  test 'renders empty values and interpolates frame limits' do
    issues = [
      ImportValidation.issue('test.message', params: { value: nil }, location: { row: 2 }),
      ImportValidation.issue('test.frames', params: { rate: 24, max: 23 })
    ]

    message = ImportValidationMessages.render(issues, :en)
    assert_includes message, 'Row 2: Timecode (empty). Check the timestamp.'
    assert_includes message, "\nFrame limit: 23 at 24 fps."
  end
end
