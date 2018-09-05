class ReadCampscapeFileJob < ApplicationJob
  queue_as :default

  def perform(file_path)
    # TODO: implement
    # TODO: index and cache interviews, people, registry_entries, etc.
    File.delete(file_path) if File.exist?(file_path)
    # TODO: send mail to someone informing about finished interview
  end
end
