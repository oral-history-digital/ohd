class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  # Imports transcript changes atomically and queues one scoped search refresh.
  #
  # @param opts [Hash] Interview, file path, tape and locale import options
  # @return [void]
  def perform(opts)
    interview = opts[:interview]
    extension = File.extname(opts[:file_path]).strip.downcase.delete_prefix('.')
    # One transaction also coalesces nested translation saves into one indexing job.
    RefreshSearchIndexJob.batch do
      Interview.transaction do
        case extension
        when *TranscriptSpreadsheetImport::EXTENSIONS
          boolean = ActiveModel::Type::Boolean.new
          frame_rate = opts[:frame_rate].presence
          frame_rate = frame_rate.to_i if frame_rate.is_a?(String) && /\A[0-9]+\z/.match?(frame_rate)
          interview.create_or_update_segments_from_spreadsheet(
            opts[:file_path],
            opts[:tape_id],
            opts[:locale],
            boolean.cast(opts[:update_only_speakers]),
            frame_rate: frame_rate,
            trim_timecodes: boolean.cast(opts[:trim_timecodes]),
            delete_existing: boolean.cast(opts[:delete_existing]),
            contributions_attributes: opts[:contributions_attributes]
          )
        when 'odt'
          interview.create_or_update_segments_from_text(
            opts[:file_path],
            opts[:tape_id],
            opts[:locale]
          )
        when 'vtt', 'srt'
          interview.create_or_update_segments_from_vtt(
            opts[:file_path],
            opts[:tape_id],
            opts[:locale],
          )
        end
        interview.touch
      end
    end
  ensure
    FileUtils.rm_f(opts[:file_path]) if opts[:filename] && opts[:file_path]
  end
end
