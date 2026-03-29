class Admin::HomepageBlockSerializer < ActiveModel::Serializer
  attributes :id,
    :code,
    :position,
    :button_primary_target,
    :button_secondary_target,
    :show_secondary_button,
    :translations_attributes,
    :images

  def translations_attributes
    object.translations.map do |translation|
      {
        id: translation.id,
        locale: translation.locale,
        heading: translation.heading,
        text: translation.text,
        button_primary_label: translation.button_primary_label,
        button_secondary_label: translation.button_secondary_label,
        image_alt: translation.image_alt
      }
    end
  end

  def images
    object.images.map do |image|
      {
        id: image.id,
        locale: image.locale,
        title: image.title,
        href: image.href,
        src: image.file&.attachment ? Rails.application.routes.url_helpers.rails_blob_path(image.file, only_path: true) : nil
      }
    end
  end
end
