require 'globalize'

class Photo < ApplicationRecord
  belongs_to :interview
  has_one_attached :photo

  translates :caption, :date, :place, :photographer, :license, fallbacks_for_empty_translations: false, touch: true

  scope :for_file, -> (filename) { where('photo_file_name LIKE ?', (filename || '').sub(/([^.]+)_\w+(\.\w{3,4})?$/,'\1\2') + '%') }

  validates_associated :interview

  def file_path 
    File.join("storage", photo.blob.key.first(2), photo.blob.key.first(4).last(2), photo.blob.key)
  end

  searchable auto_index: false do
    string :archive_id, :multiple => true, :stored => true do
      interview ? interview.archive_id : nil
    end
    string :workflow_state
    integer :id, :stored => true
    I18n.available_locales.each do |locale|
      text :"text_#{locale}", stored: true do
        caption(locale)
      end
    end
  end

  # this method should be present through 'translates: ....'
  # But it isn't. Therefore:
  #
  def translations_attributes=(atts)
    atts.each do |t|
      if t[:id] 
        translations.find(t[:id]).update_attributes locale: t[:locale], caption: t[:caption]
      else
        update_attributes t
      end
    end
  end

  def write_iptc_metadata(metadata)
    file = MiniExiftool.new file_path
    metadata.each do |k,v|
      file[k] = v
    end
    file.save
  end

  def variant_path(resolution)
    variant = photo.variant(resize: resolution)
    signed_blob_id = variant.blob.signed_id
    variation_key  = variant.variation.key
    filename       = variant.blob.filename
    Rails.application.routes.url_helpers.rails_blob_representation_path(signed_blob_id, variation_key, filename)
  end

end
