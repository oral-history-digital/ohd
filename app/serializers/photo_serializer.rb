class PhotoSerializer < ActiveModel::Serializer
  include IsoHelpers

  attributes :id, :captions, :src, :thumb_src

  def captions
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = ActionView::Base.full_sanitizer.sanitize(object.caption(projectified(locale)))
      mem
    end
  end

  def src
    #url_for object.image
    Rails.application.routes.url_helpers.rails_blob_path(object.photo, only_path: true) if object.photo.attachment
  end

  def thumb_src
    #url_for object.photo.variant(resize_to_fit: [100, 100])
    #rails_representation_url(variant)
    Rails.application.routes.url_helpers.rails_blob_path(object.photo, only_path: true) if object.photo.attachment
  end

end
