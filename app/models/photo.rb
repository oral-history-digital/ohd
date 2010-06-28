class Photo < ActiveRecord::Base

  belongs_to :interview
  
  has_attached_file :photo,
                    :styles => { :thumb => "240x80", :original => "500x500>" },
                    :url => (ApplicationController.relative_url_root || '') + "/interviews/:interview/photos/:basename_:style.:extension",
                    :path => ":rails_root/assets/archive_images/gallery/:basename_:style.:extension"

  named_scope :for_file, lambda{|filename| { :conditions => ['photo_file_name LIKE ?', (filename || '').sub(/([^.]+)_\w+(\.\w{3,4})?$/,'\1\2') + '%' ]}}
         
  validates_attachment_presence :photo           
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png']

  validates_associated :interview

end