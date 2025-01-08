class ReadEditTableJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, only_references, receiver)
    jobs_logger.info "*** uploading #{file_path} to interview #{interview.archive_id}"
    msg = EditTableImport.new(interview.archive_id, file_path, only_references).process
    #File.delete(file_path) if File.exist?(file_path)
    jobs_logger.info "*** imported edit-table for #{interview.archive_id}"
    interview.touch

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_transcript.processed',
      #file: File.basename(file_path),
      #archive_id: interview.archive_id
    #)

    AdminMailer.with(
      interview: interview,
      receiver: receiver,
      type: 'read_edit_table',
      file: file_path,
      locale: locale,
      msg: msg
    ).finished_job.deliver_now
  end

end
