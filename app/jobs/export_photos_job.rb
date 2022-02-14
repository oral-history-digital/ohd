require "#{Rails.root}/lib/metadata_import.rb"

class ExportPhotosJob < ApplicationJob
  queue_as :default

  def perform(interview_ids, receiver, project, locale)
    jobs_logger.info "*** exporting photos of interviews #{interview_ids}"
    PhotoExport.new(interview_ids, project, locale).process

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_metadata.processed',
      #file: File.basename(file_path),
    #)

    jobs_logger.info "*** exported photos of interviews #{interview_ids}"
    #AdminMailer.with(project: project, receiver: receiver, type: 'export_photos', interview_ids: interview_ids).finished_job.deliver_now
  end

end
