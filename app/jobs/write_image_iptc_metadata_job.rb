class WriteImageIptcMetadataJob < ApplicationJob
  queue_as :default

  def perform(opts)
    photo = Photo.find(opts[:photo_id])
    photo.write_iptc_metadata
  end
end
