class PhotoSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id, :captions, :src, :thumb


  def captions
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = ActionView::Base.full_sanitizer.sanitize(object.caption(projectified(locale)))
      mem
    end
    #object.caption_translations
  end

  def src
    "http://dedalo.cedis.fu-berlin.de/dedalo/media/image/original/0/#{object.photo_file_name}"
  end

  def thumb
    "http://dedalo.cedis.fu-berlin.de/dedalo/media/image/1.5MB/0/#{object.photo_file_name}"
  end

end
