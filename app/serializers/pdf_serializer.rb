class PdfSerializer < ApplicationSerializer
  attributes :id,
             :filename,
             :path,
             :title,
             :description,
             :attachable_id,
             :attachable_type,
             :workflow_state

  def filename
    object.file.filename.to_s
  end

  def path
    if object.file.blob
      Rails.application.routes.url_helpers.rails_blob_path(object.file, only_path: true)
    else
      ""
    end
  end
end
