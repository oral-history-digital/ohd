class UploadedFile < ApplicationRecord
  belongs_to :ref, polymorphic: true, touch: true
  has_one_attached :file

  after_save :symlink
  def symlink
    symlink_path = File.join(Rails.root, 'tmp', 'files', file.blob.filename.to_s)
    File.delete(symlink_path) if File.symlink?(symlink_path)
    blob_path = ActiveStorage::Blob.service.send(:path_for, file.key)
    File.symlink(blob_path, symlink_path)
  end

end
