class PhotosController < ApplicationController
  require 'open-uri'


  def src
    deliver "original/0/#{params[:name]}.jpg"
  end

  def thumb
    deliver "1.5MB/0/#{params[:name]}.jpg"
  end

  private

  def deliver file_name
    base_url = 'http://dedalo.cedis.fu-berlin.de/dedalo/media/image/'
    url = base_url + file_name
    data = open(url).read
    send_data data, :disposition => 'inline', :filename=>file_name
  end

end