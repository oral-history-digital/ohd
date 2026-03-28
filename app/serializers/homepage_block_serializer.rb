class HomepageBlockSerializer < ActiveModel::Serializer
  attributes :code,
    :position,
    :button_primary_target,
    :button_secondary_target,
    :show_secondary_button,
    :heading,
    :text,
    :button_primary_label,
    :button_secondary_label,
    :image_alt,
    :image

  def image
    image = object.image_for_locale
    return nil unless image&.file&.attachment

    {
      id: image.id,
      locale: image.locale,
      title: image.title,
      href: image.href,
      src: Rails.application.routes.url_helpers.rails_blob_path(image.file, only_path: true),
      thumb_src: thumb_src(image)
    }
  end

  private

  def thumb_src(image)
    return Rails.application.routes.url_helpers.rails_blob_path(image.file, only_path: true) unless image.file.blob.variable?

    Rails.application.routes.url_helpers.rails_representation_url(
      image.file.variant(resize: '200x200').processed,
      only_path: true
    )
  rescue StandardError
    nil
  end
end
