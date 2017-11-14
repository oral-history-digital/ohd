class PhotoSerializer < ActiveModel::Serializer
  attributes :id, :captions, :src


  def captions
    object.caption_translations
  end

  def src
    "http://dedalo.cedis.fu-berlin.de/dedalo/media/image/1.5MB/0/#{object.photo_file_name}"
  end

end
