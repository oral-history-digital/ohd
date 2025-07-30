class PdfSerializer < ApplicationSerializer
  attributes :id,
             :filename,
             :path,
             :titles,
             :language,
             :attachable_id,
             :workflow_state

  def titles
    I18n.available_locales.inject({}) do |mem, locale|
      t = object.translations.where(locale: locale).first
      mem[locale] = ActionView::Base.full_sanitizer.sanitize(t && t.title)
      mem
    end
  end

  def filename
    object.file.filename.to_s
  end

  def path
    Rails.application.routes.url_helpers.rails_blob_path(object.file, only_path: true)
  end
end
