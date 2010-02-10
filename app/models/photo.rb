class Photo < ActiveRecord::Base

  belongs_to :interview
  
  has_attached_file :photo,
                    :styles => { :thumb => "240x80", :original => "500x500>" },
                    :url => "/archive_images/gallery/:basename_:style.:extension",
                    :path => ":rails_root/public/archive_images/gallery/:basename_:style.:extension"
         
  validates_attachment_presence :photo           
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png']

end