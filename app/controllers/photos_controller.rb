class PhotosController < ApplicationController
  require 'open-uri'

  def src
    deliver "original/#{sub_folder(params[:name])}/#{params[:name]}.jpg"
  end

  def thumb
    deliver "1.5MB/#{sub_folder(params[:name])}/#{params[:name]}.jpg"
  end

  private

  def deliver file_name
    base_url = 'http://dedalo.cedis.fu-berlin.de/dedalo/media/image/'
    url = base_url + file_name
    data = open(url).read
    send_data data, :disposition => 'inline', :filename=>file_name
  end

  def sub_folder image_name
    ((image_name.split('_').last().to_i / 1000) * 1000).to_s;
  end

end
