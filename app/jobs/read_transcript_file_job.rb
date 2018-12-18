class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, tape_id, file_column_names, file_column_languages, receiver)
    interview.create_or_update_segments_from_file(file_path, tape_id, file_column_names, file_column_languages)
    File.delete(file_path) if File.exist?(file_path)
    logger.info "*** created  segments for #{interview.archive_id}"
    interview.update_attributes duration: interview.segments.last.time + 7
    clear_cache interview
    AdminMailer.with(receiver: receiver, type: 'read_protokolls', file: file_path).finished_job.deliver_now
  end

end
