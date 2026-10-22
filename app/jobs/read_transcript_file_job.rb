class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  # Imports transcript changes atomically and queues one scoped search refresh.
  #
  # @param opts [Hash] Interview, file path, tape and locale import options
  # @return [void]
  def perform(opts)
    interview = opts[:interview]
    # One transaction also coalesces nested translation saves into one indexing job.
    RefreshSearchIndexJob.batch do
      Interview.transaction do
        extension = File.extname(opts[:file_path]).strip.downcase[1..-1]
        case extension
        # only ods is tested
        when 'ods', 'xlsx', 'xlsm','xls', 'xlm', 'csv'
          interview.create_or_update_segments_from_spreadsheet(
            opts[:file_path],
            opts[:tape_id],
            opts[:locale],
            opts[:update_only_speakers]
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
  end

end
