class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(opts)
    interview = opts[:interview]
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
    Sunspot.index! interview.segments
    interview.touch
  end

end
