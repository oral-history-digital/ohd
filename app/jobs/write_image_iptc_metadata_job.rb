class WriteImageIptcMetadataJob < ApplicationJob
  queue_as :default

  def perform(photo_id, metadata={})
    photo = Photo.find(photo_id).photo

    file_path = File.join("storage", photo.blob.key.first(2), photo.blob.key.first(4).last(2), photo.blob.key)
    file = MiniExiftool.new file_path
    
    metadata.each do |k,v|
      file[k] = v
    end
    file.save
  end
end
