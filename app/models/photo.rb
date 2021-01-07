require 'globalize'

class Photo < ApplicationRecord
  belongs_to :interview
  has_one_attached :photo

  # TODO: fit this again to be used in zwar?
  #has_attached_file :photo,
                    #:styles => { :thumb => "240x80", :original => "500x500>" },
                    #:url => (ApplicationController.relative_url_root || '') + "/interviews/:interview/photos/:basename_:style.:extension",
                    #:path => ":rails_root/assets/archive_images/gallery/:basename_:style.:extension"

  translates :caption, fallbacks_for_empty_translations: false, touch: true

  scope :for_file, -> (filename) { where('photo_file_name LIKE ?', (filename || '').sub(/([^.]+)_\w+(\.\w{3,4})?$/,'\1\2') + '%') }

  # TODO: fit this again to be used in zwar?
  #validates_attachment_presence :photo
  #validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png']

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
    Rails.configuration.i18n.available_locales.each do |locale|
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

  def src
    "http://dedalo.cedis.fu-berlin.de/dedalo/media/image/original/#{sub_folder}/#{photo_file_name}.jpg"
  end

  def sub_folder
    ((photo_file_name.split('_').last().to_i / 1000) * 1000).to_s;
  end

  # TODO: fit this again to be used in zwar?
  #def photo_file_name=(filename)
    ## assign the photo - but skip this part on subsequent changes of the file name
    ## (because the filename gets assigned in the process of assigning the file)
    #if !defined?(@assigned_filename) || @assigned_filename != filename
      #archive_id = ((filename || '')[Regexp.new("^#{Project.current.initials}\\d{3}", Regexp::IGNORECASE)] || '').downcase
      #@assigned_filename = filename
      ## construct the import file path
      #filepath = File.join(Project.archive_management_dir, archive_id, 'photos', (filename || '').split('/').last.to_s)
      #if !File.exists?(filepath)
        #puts "\nERROR: missing photo file, skipping: #{filepath}"
      #else
        #File.open(filepath, 'r') do |file|
          #self.photo = file
        #end
      #end
    #else
      #write_attribute :photo_file_name, filename
    #end
  #end

end
