class UploadedFile < ApplicationRecord
  belongs_to :ref, polymorphic: true
  has_one_attached :file
end
