require 'globalize'

class Photo < ActiveRecord::Base

  belongs_to :interview

  has_attached_file :photo,
                    :styles => { :thumb => "240x80", :original => "500x500>" },
                    :url => (ApplicationController.relative_url_root || '') + "/interviews/:interview/photos/:basename_:style.:extension",
                    :path => ":rails_root/assets/archive_images/gallery/:basename_:style.:extension"

  translates :caption

  named_scope :for_file, lambda{|filename| { :conditions => ['photo_file_name LIKE ?', (filename || '').sub(/([^.]+)_\w+(\.\w{3,4})?$/,'\1\2') + '%' ]}}

  validates_attachment_presence :photo
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png']

  validates_associated :interview

  def photo_file_name=(filename)
    # assign the photo - but skip this part on subsequent changes of the file name
    # (because the filename gets assigned in the process of assigning the file)
    if !defined?(@assigned_filename) || @assigned_filename != filename
      archive_id = ((filename || '')[Regexp.new("^#{CeDiS.config.project_initials}\\d{3}", Regexp::IGNORECASE)] || '').downcase
      @assigned_filename = filename
      # construct the import file path
      filepath = File.join(CeDiS.config.archive_management_dir, archive_id, 'photos', (filename || '').split('/').last.to_s)
      if !File.exists?(filepath)
        puts "\nERROR: missing photo file, skipping: #{filepath}"
      else
        File.open(filepath, 'r') do |file|
          self.photo = file
        end
      end
    else
      write_attribute :photo_file_name, filename
    end
  end

end
