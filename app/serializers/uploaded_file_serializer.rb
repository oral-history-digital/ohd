class UploadedFileSerializer < ApplicationSerializer

  attributes :src, 
             :locale,
             :ref_id,
             :ref_type,
             :name, 
             :title,
             :href

  def name
    I18n.available_locales.inject({}) do |mem, locale|
      mem[locale] = I18n.t("activerecord.models.#{object.type.underscore}.one", locale: locale) + " #{object.locale}"
      mem
    end
  end

  def src
    Rails.application.routes.url_helpers.rails_blob_path(object.file, only_path: true) if object.file.attachment
  end

end
