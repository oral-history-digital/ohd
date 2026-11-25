# frozen_string_literal: true

# Validates ODT tape timing and applies replacement atomically with the transcript.
class TranscriptOdtImport
  # @param tape [Tape] Destination tape scoped to the interview
  # @param locale [String] Transcript language
  # @param options [Hash] Raw timing values, contributions, and replacement setting
  def initialize(tape, locale, options)
    @tape = tape
    @interview = tape.interview
    @locale = locale
    @options = options
  end

  # @param file_path [String] Uploaded ODT path
  # @return [void]
  # @raise [Timecode::ImportFormatError] If timing values are missing, malformed, or inconsistent
  def call(file_path)
    @interview.with_lock(requires_new: true) do
      settings = validate!
      settings.each do |tape, duration, shift|
        tape.assign_attributes(duration: duration, time_shift: shift)
        tape.save!
      end
      (@options[:contributions_attributes] || {}).each_value do |attributes|
        @interview.contributions.find(attributes[:id]).update!(speaker_designation: attributes[:speaker_designation])
      end
      @tape.segments.each(&:destroy!) if @options[:delete_existing]
      @interview.create_or_update_segments_from_text(file_path, @tape.id, @locale)
    end
  end

  # Checks timing and proposed contribution ownership without writing records.
  #
  # @return [Array<Array>] Validated tape, duration, and shift settings
  # @raise [Timecode::ImportFormatError] If timing is invalid
  def validate!
    TranscriptImportContributions.resolve(@interview, @options[:contributions_attributes])
    timing_settings
  end

  private

  # Checks comma-separated timing entries in tape order, starting at the selected tape.
  #
  # @return [Array<Array>] Tape, duration in seconds, and shift in seconds
  # @raise [Timecode::ImportFormatError] If any timing entry is invalid
  def timing_settings
    durations = @options[:tape_durations].to_s.split(',', -1) # keep trailing empty values for tapes with no duration
    durations = [''] if durations.empty?
    shifts = @options[:time_shifts].presence&.split(',', -1)
    errors = []
    if shifts && shifts.length != durations.length
      errors << ImportValidation.issue('odt.shift_count')
    end
    settings = durations.each_with_index.map do |raw, index|
      # Each list entry applies to the next tape, starting with the selected tape.
      number = @tape.number + index
      tape = @interview.tapes.find_by(number: number)
      errors << ImportValidation.issue('tape.missing', location: { tape: number }) unless tape
      duration = timing_value(raw, number, 'duration', errors)
      shift = timing_value(shifts ? shifts[index] : '00:00:00', number, 'time_shift', errors)
      if duration && shift && duration <= shift
        errors << ImportValidation.issue('odt.interval', location: { tape: number })
      end
      [tape, duration, shift]
    end
    raise Timecode::ImportFormatError.new(errors) if errors.any?

    settings
  end

  # Converts a whole-second input matching the integer tape timing columns.
  #
  # @param raw [String, nil] Uploaded field value
  # @param number [Integer] Tape number
  # @param field [String] Field name for the diagnostic
  # @param errors [Array<Hash>] Collected structured diagnostics
  # @return [Integer, nil] Seconds, or nil when invalid
  def timing_value(raw, number, field, errors)
    value = raw.to_s.strip
    canonical = Timecode.parse_import("#{value}.000") # Add milliseconds to match the Timecode parser format
    Timecode.parse_timecode(canonical).to_i # Convert to seconds for the tape model
  rescue Timecode::ImportFormatError
    errors << ImportValidation.issue('odt.timing_format', params: { value: raw }, location: { tape: number, field: field })
    nil
  end
end
