class Photo < ActiveRecord::Base

  belongs_to :interview
  
  has_attached_file :photo,
                    :styles => { :thumb => "240x60", :original => "500x500>" },
                    :url => "/public/archive_images/gallery/:basename.:extension",
                    :path => ":rails_root/public/archive_images/gallery/:basename.:extension"
         
  validates_attachment_presence :photo           
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png']

end