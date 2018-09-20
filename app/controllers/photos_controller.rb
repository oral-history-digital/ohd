class PhotosController < BaseController
  require 'open-uri'

  def create
    # Writing meta data
    data = params[:photo].delete(:data)
    #data = MiniExiftool.new params[:photo].delete(:data)
    #data.title = photo_params[:caption]
    #data.save
    @photo = Photo.create(photo_params)
    @photo.photo.attach(io: data, filename: "#{@photo.interview.archive_id.upcase}_#{str = format('%02d', @photo.interview.photos.count)}")

    clear_cache @photo.interview

    #file_path = File.join(Rails.root, 'tmp', file.original_filename)
    #File.open(file_path, 'wb') {|f| f.write(file.read) }
    #@photo.image.attach(io: File.open('/path/to/file'), filename: 'file.pdf', content_type: 'application/pdf')

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @photo.interview.archive_id,
          nested_data_type: 'photos',
          nested_id: @photo.id,
          data: ::PhotoSerializer.new(@photo).as_json
        }
      end
    end
  end

  def edit
    @photo = Photo.update_attributes(photo_params)
    clear_cache @photo.interview

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @photo.interview.archive_id,
          nested_data_type: 'photos',
          nested_id: @photo.id,
          data: ::PhotoSerializer.new(@photo).as_json
        }
      end
    end
  end

  def destroy 
    @photo = Photo.find(params[:id])
    @photo.destroy
    clear_cache @photo.interview

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def src
    deliver "original/#{sub_folder(params[:name])}/#{params[:name]}.jpg"
  end

  def thumb
    deliver "1.5MB/#{sub_folder(params[:name])}/#{params[:name]}.jpg"
  end

  private

  def photo_params
    params.require(:photo).permit(:interview_id, :caption)
  end

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
