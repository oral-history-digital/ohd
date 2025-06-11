class MaterialSerializer < ApplicationSerializer
  include ActionView::Helpers::NumberHelper

  attributes :id,
             :filename,
             :size,
             :size_human,
             :content_type,
             :path,
             :title,
             :description,
             :attachable_id,
             :attachable_type,
             :workflow_state

  def filename
    object.file_blob.filename.to_s
  end

  def size
    object.file_blob.byte_size
  end

  def size_human
    number_to_human_size(object.file_blob.byte_size)
  end

  def content_type
    object.file_blob.content_type
  end

  def path
    if object.file.blob
      Rails.application.routes.url_helpers.rails_blob_path(object.file, only_path: true)
    else
      ""
    end
  end
end
