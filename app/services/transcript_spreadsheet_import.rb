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
    @interview = tape.interview
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

    @interview.with_lock(requires_new: true) do
      (@options[:contributions_attributes] || {}).each_value do |attributes|
        @interview.contributions.find(attributes[:id]).update!(speaker_designation: attributes[:speaker_designation])
      end

      speakers = @interview.contributions.reload.select { |contribution| contribution.speaker_designation.present? }
      speakers_by_designation = speakers.group_by(&:speaker_designation)
      rows.each do |row|
        row[:speaker_ids] = speakers_by_designation.fetch(row[:speaker], []).map(&:person_id).uniq
        row[:speaker_id] = row[:speaker_ids].first
      end

      if @options[:delete_existing]
        @tape.segments.destroy_all
      else
        match_segments(rows)
      end

      tape_end = Timecode.new(@tape.duration).time

      rows.each_with_index do |row, index|
        speaker_id = row[:speaker_id]
        segment = row[:segment] || @tape.segments.build(interview_id: @interview.id, timecode: row[:timecode])
        if @options[:update_only_speakers] && speaker_id
          segment.update!(speaker_id: speaker_id)
        else
          next_time = rows[index + 1]&.fetch(:time) || tape_end
          duration = next_time - row[:time]
          attributes = { text: row[:transcript] || '', locale: @locale, speaker_id: speaker_id }
          attributes[:duration] = duration if duration.positive?
          segment.update!(attributes)
        end
      rescue ActiveRecord::RecordInvalid => e
        raise unless e.record.errors[:timecode].any?

        raise Timecode::ImportFormatError,
              "#{row[:location]}: timecode #{row[:original]}. #{e.record.errors[:timecode].join('. ')}"
      end
    end
  end

  private

  # Resolves update targets by timecode, using the speaker when a start time is shared.
  #
  # @param rows [Array<Hash>] Parsed rows with candidate speaker IDs
  # @return [void]
  # @raise [Timecode::ImportFormatError] If a row cannot identify a unique segment
  def match_segments(rows)
    by_timecode = rows.group_by { |row| row[:timecode] }
    existing = @tape.segments.where(interview_id: @interview.id, timecode: by_timecode.keys).group_by(&:timecode)
    errors = []

    by_timecode.each do |timecode, matching_rows|
      candidates = existing.fetch(timecode, [])
      if matching_rows.one? && candidates.size <= 1
        matching_rows.first[:segment] = candidates.first
        next
      end

      rows_per_speaker = matching_rows.map { |row| row[:speaker_id] }.tally
      candidates_by_speaker = candidates.group_by(&:speaker_id)
      matching_rows.each do |row|
        speaker_id = row[:speaker_id]
        matches = candidates_by_speaker.fetch(speaker_id, [])
        if row[:speaker_ids].one? && speaker_id && rows_per_speaker[speaker_id] == 1 &&
           (candidates.empty? || matches.one?)
          row[:segment] = matches.first
        else
          errors << "#{row[:location]}: timecode #{row[:original]} is shared. " \
                    'Use a recognized speaker designation that identifies a single segment and appears once at this timecode in the file.'
        end
      end
    end

    raise Timecode::ImportFormatError, errors.join("\n") if errors.any?
  end

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
