class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, tape_id, locale, receiver)
    extension = File.extname(file_path).strip.downcase[1..-1]
    case extension
    # only ods is tested
    when 'ods', 'xlsx', 'xlsm','xls', 'xlm', 'csv'
      interview.create_or_update_segments_from_spreadsheet(file_path, tape_id, locale)
    when 'vtt', 'srt'
      interview.create_or_update_segments_from_vtt(file_path, tape_id, locale)
    end
    File.delete(file_path) if File.exist?(file_path)
    logger.info "*** created  segments for #{interview.archive_id}"
    interview.update_attributes duration: interview.segments.last.time + 7
    clear_cache interview
    AdminMailer.with(receiver: receiver, type: 'read_protokolls', file: file_path).finished_job.deliver_now
  end

end
