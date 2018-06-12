class ReadTranscriptFileJob < ApplicationJob
  queue_as :default

  def perform(interview, file_path, tape_id, opts={})
    #file = File.read file_path
    interview.create_or_update_segments_from_file_for_tape(file_path, tape_id, opts)
    File.delete(file_path) if File.exist?(file_path)
  end
end
