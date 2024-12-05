class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, tape_id, locale, receiver, update_only_speakers=false)
    jobs_logger.info "*** uploading #{file_path} to interview #{interview.archive_id} and tape #{tape_id}"
    extension = File.extname(file_path).strip.downcase[1..-1]
    case extension
    # only ods is tested
    when 'ods', 'xlsx', 'xlsm','xls', 'xlm', 'csv'
      interview.create_or_update_segments_from_spreadsheet(file_path, tape_id, locale, update_only_speakers)
    when 'odt'
      interview.create_or_update_segments_from_text(file_path, tape_id, locale)
    when 'vtt', 'srt'
      interview.create_or_update_segments_from_vtt(file_path, tape_id, locale)
    end
    Sunspot.index! interview.segments
    File.delete(file_path) if File.exist?(file_path)
    jobs_logger.info "*** created  segments for #{interview.archive_id}"
    interview.touch

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_transcript.processed',
      #file: File.basename(file_path),
      #archive_id: interview.archive_id
    #)

    AdminMailer.with(interview: interview, receiver: receiver, type: 'read_transcript', file: file_path, locale: locale).finished_job.deliver_now
  end

end
