# Validates one tape's spreadsheet rows before replacing or updating its segments.
class TranscriptSpreadsheetImport
  EXTENSIONS = %w[ods xlsx xlsm xls xlm csv].freeze
  HEADERS = {
    timecode: /^Timecode|In$/i,
    transcript: /^Trans[k|c]ript|Translation|Übersetzung$/i,
    speaker: /^Speaker|Sprecher$/i
  }.freeze

  # @param tape [Tape] Tape scoped to the upload's interview
  # @param locale [String] Transcript locale
  # @param options [Hash] Format, replacement, and speaker settings
  def initialize(tape, locale, options)
    @tape = tape
    @locale = locale
    @options = options
  end

  # Imports validated rows and rolls back all changes when a write fails.
  #
  # @param file_path [String] Path to the uploaded spreadsheet
  # @return [void]
  # @raise [Timecode::ImportFormatError] If an input timestamp cannot be imported
  def call(file_path)
    rows = parse_rows(file_path)
    if rows.empty?
      raise Timecode::ImportFormatError,
            'The spreadsheet has no transcript rows. Add at least one row and upload it again.'
    end

    tape_end = Timecode.new(@tape.duration).time
    rows.each_with_index do |row, index|
      next_time = rows[index + 1]&.fetch(:time) || tape_end
      row[:duration] = next_time - row[:time]
    end
    TranscriptSegmentImport.new(@tape, @locale, @options).call(rows)
  end

  private

  # Parses each worksheet in order and checks the normalized values for this tape.
  #
  # @param file_path [String] Path to the uploaded spreadsheet
  # @return [Array<Hash>] Rows with canonical timecodes and their source locations
  def parse_rows(file_path)
    workbook = Roo::Spreadsheet.open(file_path, csv_options: CSV_OPTIONS)
    rows = []
    errors = []
    previous = nil
    workbook.each_with_pagename do |name, sheet|
      sheet.parse(HEADERS).each.with_index(sheet.header_line + 1) do |row, line|
        location = "Sheet #{name.inspect}, row #{line}"
        raw = row[:timecode]
        original = raw.nil? ? '(empty)' : raw.to_s.truncate(100).inspect
        value = @options[:trim_timecodes] && raw.is_a?(String) ? raw.strip : raw
        begin
          timecode = Timecode.parse_import(value, frame_rate: @options[:frame_rate])
        rescue Timecode::ImportFormatError => e
          errors << "#{location}: timecode #{original}. #{e.message}"
          next
        end

        if previous && ([timecode.length, timecode] <=> [previous.length, previous]).negative?
          # Only the hour field varies in width, so compare width before digits.
          errors << "#{location}: timecode #{original} cannot be earlier than #{previous} on the same tape."
        end

        previous = timecode
        rows << row.merge(timecode: timecode, time: Timecode.parse_timecode(timecode.dup), location: location,
                          original: original)
      end
    end

    raise Timecode::ImportFormatError, errors.join("\n") if errors.any?

    rows
  end
end
