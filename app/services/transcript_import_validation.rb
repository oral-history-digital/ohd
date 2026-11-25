# frozen_string_literal: true

# Selects the existing read-only validator using the queued import's file and settings.
class TranscriptImportValidation
  # @param options [Hash] Authorized interview, tape ID, path, locale, and import settings
  def initialize(options)
    @options = options
  end

  # Checks timestamps and segment targets without saving records or queuing jobs.
  # @return [void]
  # @raise [Timecode::ImportFormatError] If the format, timing, or targets are invalid
  def validate!
    tape = @options[:interview].tapes.find(@options[:tape_id])
    boolean = ActiveModel::Type::Boolean.new
    settings = @options.merge(
      delete_existing: boolean.cast(@options[:delete_existing]),
      update_only_speakers: boolean.cast(@options[:update_only_speakers])
    )
    path = @options[:file_path]
    case File.extname(path).downcase.delete_prefix('.')
    when *TranscriptSpreadsheetImport::EXTENSIONS
      rate = @options[:frame_rate].presence
      rate = rate.to_i if rate.is_a?(String) && /\A[0-9]+\z/.match?(rate)
      TranscriptSpreadsheetImport.new(tape, @options[:locale], settings.merge(frame_rate: rate)).validate!(path)
    when *TranscriptSubtitleReader::EXTENSIONS
      rows = TranscriptSubtitleReader.new(path).call
      TranscriptSegmentImport.new(tape, @options[:locale], settings).validate!(rows)
    when 'odt'
      TranscriptOdtImport.new(tape, @options[:locale], settings).validate!
    else
      raise Timecode::ImportFormatError.new(ImportValidation.issue('file.unsupported_format'))
    end
    nil
  end
end
