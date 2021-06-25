class UploadedFile < ApplicationRecord
  belongs_to :ref, polymorphic: true, touch: true
  has_one_attached :file
end
