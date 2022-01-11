require "#{Rails.root}/lib/metadata_import.rb"

class ReadBulkMetadataFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver, project, locale)
    jobs_logger.info "*** uploading #{file_path} metadata"
    MetadataImport.new(file_path, project, locale).process

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_metadata.processed',
      #file: File.basename(file_path),
    #)

    jobs_logger.info "*** uploaded #{file_path} metadata"
    AdminMailer.with(project: project, receiver: receiver, type: 'read_bulk_metadata', file: file_path).finished_job.deliver_now
    File.delete(file_path) if File.exist?(file_path)
  end

end
