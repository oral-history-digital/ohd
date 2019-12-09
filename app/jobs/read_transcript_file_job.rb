class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, tape_id, locale, receiver, contribution_data, tape_shifts=[])
    extension = File.extname(file_path).strip.downcase[1..-1]
    case extension
    # only ods is tested
    when 'ods', 'xlsx', 'xlsm','xls', 'xlm', 'csv'
      interview.create_or_update_segments_from_spreadsheet(file_path, tape_id, locale, contribution_data)
    when 'odt'
      interview.create_or_update_segments_from_text(file_path, tape_id, locale, contribution_data)
    when 'vtt', 'srt'
      interview.create_or_update_segments_from_vtt(file_path, tape_id, locale, contribution_data)
    end
    File.delete(file_path) if File.exist?(file_path)
    logger.info "*** created  segments for #{interview.archive_id}"
    interview.touch

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_transcript.processed',
      #file: File.basename(file_path),
      #archive_id: interview.archive_id
    #)

    AdminMailer.with(receiver: receiver, type: 'read_protokolls', file: file_path).finished_job.deliver_now
  end

end
