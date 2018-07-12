class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, tape_id, file_column_names, file_column_languages)
    interview.create_or_update_segments_from_file(file_path, tape_id, file_column_names, file_column_languages)
    File.delete(file_path) if File.exist?(file_path)
    # TODO: index and cache interview
    # TODO: send mail to someone informing about finished interview
  end
end
