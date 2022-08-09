class WriteImageIptcMetadataJob < ApplicationJob
  queue_as :default

  def perform(photo_id)
    photo = Photo.find(photo_id)
    photo.write_iptc_metadata
    jobs_logger.info "*** wrote iptc-metadata for photo #{photo_id} of interview #{photo.interview.archive_id}"
  end
end
