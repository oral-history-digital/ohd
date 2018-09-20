class WriteImageIptcMetadataJob < ApplicationJob
  queue_as :default

  def perform(photo_id, metadata={})
    file = MiniExiftool.new Photo.find(photo_id).file_path
    
    metadata.each do |k,v|
      file[k] = v
    end
    file.save
  end
end
