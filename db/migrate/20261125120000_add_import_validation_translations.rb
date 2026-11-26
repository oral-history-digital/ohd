# Adds localized diagnostics shared by import emails and frontend pre-checks.
class AddImportValidationTranslations < ActiveRecord::Migration[8.1]
  TRANSLATIONS = {
    'timecode.milliseconds_format' => [
      'Use colons (:) between hours, minutes, and seconds, then a dot (.) followed by three millisecond digits, as in 00:04:29.000.',
      'Zwischen Stunden, Minuten und Sekunden müssen Doppelpunkte (:) stehen, vor den drei Millisekundenstellen ein Punkt (.), zum Beispiel 00:04:29.000.'
    ],
    'timecode.frames_format' => [
      'Use colons (:) between hours, minutes, seconds, and the two-digit frame number, as in 00:04:29:12.',
      'Zwischen Stunden, Minuten, Sekunden und der zweistelligen Frame-Nummer müssen Doppelpunkte (:) stehen, zum Beispiel 00:04:29:12.'
    ],
    'timecode.frame_rate' => [
      'Choose a supported source frame rate (%{rates} fps).',
      'Wählen Sie eine unterstützte Bildrate der Quelldatei (%{rates} fps).'
    ],
    'timecode.frames_out_of_range' => [
      'At %{rate} fps, the frame number must be between 00 and %{max}.',
      'Bei %{rate} fps muss die Frame-Nummer zwischen 00 und %{max} liegen.'
    ],
    'timecode.minutes_out_of_range' => [
      'Minutes must be between 00 and 59.',
      'Minuten müssen zwischen 00 und 59 liegen.'
    ],
    'timecode.seconds_out_of_range' => [
      'Seconds must be between 00 and 59.',
      'Sekunden müssen zwischen 00 und 59 liegen.'
    ],
    'timecode.out_of_order' => [
      'The timecode cannot be earlier than %{previous} on the same tape.',
      'Der Timecode darf auf demselben Band nicht vor %{previous} liegen.'
    ],
    'timecode.save_failed' => [
      'This timecode could not be saved. Check its format and upload the file again.',
      'Dieser Timecode konnte nicht gespeichert werden. Prüfen Sie das Format und laden Sie die Datei erneut hoch.'
    ],
    'spreadsheet.empty' => [
      'The spreadsheet has no transcript rows. Add at least one row and upload it again.',
      'Die Tabelle enthält keine Transkriptzeilen. Fügen Sie mindestens eine Zeile hinzu und laden Sie die Datei erneut hoch.'
    ],
    'edit_table.empty' => [
      'The edit table has no rows. Add at least one row and upload it again.',
      'Die Erschließungstabelle enthält keine Zeilen. Fügen Sie mindestens eine Zeile hinzu und laden Sie die Datei erneut hoch.'
    ],
    'segment.ambiguous' => [
      'This timecode is shared. Use a recognized speaker designation that identifies a single segment and appears once at this timecode in the file.',
      'Dieser Timecode kommt mehrfach vor. Verwenden Sie ein zugeordnetes Sprecherkürzel, das ein Segment eindeutig bezeichnet und bei diesem Timecode nur einmal in der Datei vorkommt.'
    ],
    'segment.not_unique' => [
      'The timecode must identify one existing segment. Check the tape, timecode, and speaker designation.',
      'Der Timecode muss genau ein vorhandenes Segment bestimmen. Prüfen Sie Band, Timecode und Sprecherkürzel.'
    ],
    'tape.invalid_number' => [
      'Use a positive whole tape number.',
      'Verwenden Sie eine positive ganze Bandnummer.'
    ],
    'tape.missing' => [
      'No tape with this number exists in the interview.',
      'Für dieses Interview gibt es kein Band mit dieser Nummer.'
    ],
    'odt.shift_count' => [
      'Provide one time shift for each tape duration, or leave time shifts empty to start at zero.',
      'Geben Sie für jede Banddauer eine Startzeit an oder lassen Sie die Startzeiten leer, um bei null zu beginnen.'
    ],
    'odt.interval' => [
      'Duration must be later than the time shift so the transcript has a positive time interval.',
      'Die Banddauer muss größer als die Startzeit sein, damit Zeit für das Transkript verbleibt.'
    ],
    'odt.timing_format' => [
      'Use HH:MM:SS with minutes and seconds between 00 and 59, for example 01:30:00.',
      'Verwenden Sie HH:MM:SS mit Minuten und Sekunden zwischen 00 und 59, zum Beispiel 01:30:00.'
    ],
    'subtitle.vtt_header' => [
      'A WebVTT file must start with WEBVTT.',
      'Eine WebVTT-Datei muss mit WEBVTT beginnen.'
    ],
    'subtitle.header_spacing' => [
      'Add a blank line before the first WebVTT cue.',
      'Fügen Sie vor dem ersten WebVTT-Untertitel eine Leerzeile ein.'
    ],
    'subtitle.timing_line' => [
      'Expected cue start and end timestamps separated by -->.',
      'Start- und Endzeit des Untertitels müssen durch --> getrennt sein.'
    ],
    'subtitle.interval' => [
      'Cue end %{end} must be later than start %{start}.',
      'Die Endzeit %{end} des Untertitels muss nach der Startzeit %{start} liegen.'
    ],
    'subtitle.empty' => [
      'No subtitle cues found. Add at least one cue and upload the file again.',
      'Keine Untertitel gefunden. Fügen Sie mindestens einen Untertitel hinzu und laden Sie die Datei erneut hoch.'
    ],
    'subtitle.vtt_format' => [
      'Use HH:MM:SS.mmm or MM:SS.mmm, for example 00:01:54.000.',
      'Verwenden Sie HH:MM:SS.mmm oder MM:SS.mmm, zum Beispiel 00:01:54.000.'
    ],
    'subtitle.srt_format' => [
      'Use HH:MM:SS,mmm, for example 00:01:54,000.',
      'Verwenden Sie HH:MM:SS,mmm, zum Beispiel 00:01:54,000.'
    ],
    'location.sheet' => [
      'Sheet "%{value}"',
      'Tabellenblatt „%{value}“'
    ],
    'location.row' => [
      'Row %{value}',
      'Zeile %{value}'
    ],
    'location.line' => [
      'Line %{value}',
      'Zeile %{value}'
    ],
    'location.tape' => [
      'Tape %{value}',
      'Band %{value}'
    ],
    'field.timecode' => [
      'Timecode',
      'Timecode'
    ],
    'field.start' => [
      'Cue start timestamp',
      'Startzeit des Untertitels'
    ],
    'field.end' => [
      'Cue end timestamp',
      'Endzeit des Untertitels'
    ],
    'field.duration' => [
      'Duration',
      'Banddauer'
    ],
    'field.time_shift' => [
      'Time shift',
      'Startzeit'
    ],
    'field.tape_number' => [
      'Tape number',
      'Bandnummer'
    ],
    'empty_value' => [
      '(empty)',
      '(leer)'
    ],
    'value_message' => [
      '%{field} %{value}. %{message}',
      '%{field} %{value}. %{message}'
    ],
    'located_message' => [
      '%{location}: %{message}',
      '%{location}: %{message}'
    ]
  }.freeze

  # Stores the diagnostic messages in the runtime translation database.
  # @return [void]
  def up
    TRANSLATIONS.each do |code, texts|
      value = TranslationValue.find_or_create_by!(key: "import_validation.#{code}")
      %w[en de].zip(texts).each do |locale, text|
        value.translations.find_or_initialize_by(locale: locale).update!(value: text)
      end
    end
  end

  # Removes only the keys introduced by this migration.
  # @return [void]
  def down
    TranslationValue.where(key: TRANSLATIONS.keys.map { |code| "import_validation.#{code}" }).destroy_all
  end
end
