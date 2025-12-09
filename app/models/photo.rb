require 'globalize'

class Photo < ApplicationRecord
  belongs_to :interview, touch: true
  has_one_attached :photo

  translates :caption, :date, :place, :photographer, :license, fallbacks_for_empty_translations: false, touch: true
  accepts_nested_attributes_for :translations

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

  def write_iptc_metadata
    file = MiniExiftool.new ActiveStorage::Blob.service.path_for(photo.key)
    file[:title] = public_id
    file[:caption] = translations.map(&:caption).join(' ')
    file[:creator] = translations.map(&:photographer).join(' ')
    file[:headline] = translations.map do |t|
      "#{interview.archive_id} - #{TranslationValue.for('interview_with', t.locale)} #{interview.short_title(t.locale)}"
    end.join(' ')
    file[:copyright] = translations.map(&:license).join(' ')
    file[:date] = translations.map(&:date).join(' ')
    file[:city] = translations.map(&:place).join(' ')
    file.save
  end

  def variant_path(resolution)
    if photo.variable?
      variant = photo.variant(resize: resolution, auto_orient: true, strip: true)
      signed_blob_id = variant.blob.signed_id
      variation_key  = variant.variation.key
      filename       = variant.blob.filename
      Rails.application.routes.url_helpers.rails_blob_representation_path(signed_blob_id, variation_key, filename)
    end
  end

  def recalculate_checksum
    blob = photo.blob
    blob.update_column(:checksum, Digest::MD5.base64digest(File.read(blob.service.path_for(blob.key)))) if blob
  end

  def name
    n = photo_file_name || photo.blob[:filename]
    unless %w(jpg jpeg png gif tiff pdf psd eps ai indd raw).include?(n.split('.').last.downcase)
      n += ".#{photo.blob.content_type.split('/').last}" if photo.blob
    end
    n
  end

end
