class Material < ApplicationRecord
  belongs_to :attachable, polymorphic: true, touch: true
  has_one_attached :file

  translates :title, :description
  accepts_nested_attributes_for :translations

  def file_path
    key = file.blob.key
    File.join("storage", key.first(2), key.first(4).last(2), key)
  end
end
