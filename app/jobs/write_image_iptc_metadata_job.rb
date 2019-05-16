class WriteImageIptcMetadataJob < ApplicationJob
  queue_as :default

  def perform(photo_id, metadata={})
    photo = Photo.find(photo_id)
    photo.write_iptc_metadata(metadata)
  end
end
