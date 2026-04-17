class Material < ApplicationRecord
  belongs_to :attachable, polymorphic: true, touch: true
  has_one_attached :file
  before_save :scan_for_viruses

  translates :title, :description, touch: true
  accepts_nested_attributes_for :translations

  def file_path
    key = file.blob.key
    File.join("storage", key.first(2), key.first(4).last(2), key)
  end

  private

  def scan_for_viruses
    return unless self.attachment_changes['file']
    path = self.attachment_changes['file'].attachable[:io].tempfile.path
    Clamby.safe?(path)
  end
end
