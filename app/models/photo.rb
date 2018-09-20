require 'globalize'

class Photo < ActiveRecord::Base

  belongs_to :interview
  has_one_attached :photo

  # TODO: fit this again to be used in zwar?
  #has_attached_file :photo,
                    #:styles => { :thumb => "240x80", :original => "500x500>" },
                    #:url => (ApplicationController.relative_url_root || '') + "/interviews/:interview/photos/:basename_:style.:extension",
                    #:path => ":rails_root/assets/archive_images/gallery/:basename_:style.:extension"

  translates :caption

  scope :for_file, -> (filename) { where('photo_file_name LIKE ?', (filename || '').sub(/([^.]+)_\w+(\.\w{3,4})?$/,'\1\2') + '%') }

  # TODO: fit this again to be used in zwar?
  #validates_attachment_presence :photo
  #validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png']

  validates_associated :interview

  # TODO: sth. like the following might help when migrating images from dedalo to some FU-server
  #
  #def src(image_name)
    #"http://dedalo.cedis.fu-berlin.de/dedalo/media/image/original/#{sub_folder(image_name)}/#{image_name}.jpg"
  #end

  #def sub_folder(image_name)
    #((image_name.split('_').last().to_i / 1000) * 1000).to_s;
  #end

  # TODO: fit this again to be used in zwar?
  #def photo_file_name=(filename)
    ## assign the photo - but skip this part on subsequent changes of the file name
    ## (because the filename gets assigned in the process of assigning the file)
    #if !defined?(@assigned_filename) || @assigned_filename != filename
      #archive_id = ((filename || '')[Regexp.new("^#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)] || '').downcase
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
