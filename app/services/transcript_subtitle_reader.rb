require 'webvtt'

# Reads source cue timing and text before a subtitle import writes any segments.
class TranscriptSubtitleReader
  EXTENSIONS = %w[vtt srt].freeze
  VTT_TIMESTAMP = /\A(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})\z/
  SRT_TIMESTAMP = /\A(\d+):(\d{1,2}):(\d{1,2}),(\d{3})\z/
  SPEAKER_TAG = /<v (\S+)>/

  # @param file_path [String] Path to the VTT or SRT upload
  def initialize(file_path)
    @file_path = file_path
    @vtt = File.extname(file_path).strip.casecmp?('.vtt')
  end

  # Reads explicit VTT voice tags independently of cue timing, excluding metadata blocks.
  # @return [Array<String>] Unique designations supported by the subtitle importer
  def speaker_designations
    return [] unless @vtt

    # Read UTF-8 text, stripping an optional BOM, and normalize CRLF/CR line endings to LF.
    # Blank lines separate VTT blocks; inspect each block without parsing its timestamps.
    File.read(@file_path, encoding: 'bom|utf-8').gsub(/\r\n?/, "\n").split(/\n\s*\n/).flat_map do |block|
      next [] if block.strip.match?(/\A(?:WEBVTT|NOTE(?:[ \t]|\n|\z)|STYLE(?:\n|\z)|REGION(?:\n|\z))/)

      block.scan(SPEAKER_TAG).flatten
    end.uniq
  end

  # @return [Array<Hash>] Validated cue rows ready for the transcript writer
  # @raise [Timecode::ImportFormatError] If the source timing or cue structure is invalid
  def call
    # Blank lines separate blocks. Keep each line's original number for the error email.
    blocks = File.read(@file_path, encoding: 'bom|utf-8').gsub(/\r\n?/, "\n").lines.each.with_index(1)
                 .chunk { |line, _| line.strip.present? }.filter_map { |present, lines| lines if present }
    if @vtt
      # WebVTT keeps the file header in its own block before the first cue.
      header = blocks.shift
      unless header&.first&.first&.match?(/\AWEBVTT(?:[ \t]|\n|\z)/)
        raise Timecode::ImportFormatError.new(ImportValidation.issue('subtitle.vtt_header', location: { line: 1 }))
      end
      if (cue_line = header.drop(1).find { |text, _| text.include?('-->') })
        raise Timecode::ImportFormatError.new(ImportValidation.issue('subtitle.header_spacing', location: { line: cue_line.last }))
      end
    end

    errors = []
    rows = blocks.filter_map do |block|
      first_line = block.first.first.strip
      # NOTE, STYLE, and REGION blocks have no cue timestamps.
      next if @vtt && first_line.match?(/\A(?:NOTE(?:[ \t]|\z)|STYLE\z|REGION\z)/)

      # A cue can start with its timing line or have an identifier on the line above.
      timing_index = first_line.include?('-->') || first_line.match?(/\A\d+[:.,]/) ? 0 : 1
      timing, line = block[timing_index] || block.last
      location = { line: line }
      start_value, arrow, end_value = timing.partition('-->')
      if arrow.empty?
        errors << ImportValidation.issue('subtitle.timing_line', location: location)
        next
      end

      start_value = start_value.strip
      # Optional cue settings can follow the end timestamp on the same line.
      end_value = end_value.split.first
      start = timestamp(start_value, 'start', location, errors)
      finish = timestamp(end_value, 'end', location, errors)
      next unless start && finish

      duration = finish.last - start.last
      unless duration.positive?
        errors << ImportValidation.issue('subtitle.interval', params: { start: start_value, end: end_value }, location: location)
        next
      end

      # The cue parser requires a timing line. Supply a placeholder to read only the text.
      text_lines = block.drop(timing_index + 1).map(&:first)
      cue = WebVTT::Cue.parse("00:00:00.000 --> 00:00:01.000\n#{text_lines.join}")
      text = cue.text.to_s
      {
        timecode: start.first,
        duration: duration / 1000.0,
        speaker: text[SPEAKER_TAG, 1],
        transcript: text.sub(/<v \S+> /, ''),
        location: location,
        original: start_value
      }
    end

    # Send one report for the entire file before the importer can write any segments.
    raise Timecode::ImportFormatError.new(errors) if errors.any?
    raise Timecode::ImportFormatError.new(ImportValidation.issue('subtitle.empty')) if rows.empty?

    rows
  end

  private

  # Checks a source timestamp and converts it without rounding.
  #
  # @param value [String, nil] Source timestamp
  # @param field [String] Cue boundary name
  # @param location [Hash] Source line
  # @param errors [Array<Hash>] Structured diagnostics for the file
  # @return [Array, nil] Canonical timestamp and integer milliseconds, or nil on failure
  def timestamp(value, field, location, errors)
    match = (@vtt ? VTT_TIMESTAMP : SRT_TIMESTAMP).match(value.to_s)
    unless match
      code = @vtt ? 'subtitle.vtt_format' : 'subtitle.srt_format'
      raise Timecode::ImportFormatError.new(ImportValidation.issue(code))
    end

    # A short WebVTT timestamp has no hours capture. nil.to_i supplies zero.
    hours, minutes, seconds, milliseconds = match.captures.map(&:to_i)
    canonical = [hours, minutes, seconds].map { |part| part.to_s.rjust(2, '0') }.join(':')
    canonical = Timecode.parse_import("#{canonical}.#{match[4]}")
    [canonical, ((hours * 60 + minutes) * 60 + seconds) * 1000 + milliseconds]
  rescue Timecode::ImportFormatError => e
    errors.concat(ImportValidation.contextualize(e.issues, value: value, location: location.merge(field: field)))
    nil
  end
end
