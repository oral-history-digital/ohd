class PhotosController < ApplicationController
  require 'open-uri'

  def create
    authorize Photo
    data = params[:photo].delete(:data)
    @photo = Photo.create(photo_params)
    @photo.photo.attach(io: data, filename: "#{@photo.interview.archive_id.upcase}_#{str = format('%02d', @photo.interview.photos.count)}", metadata: {title: photo_params[:caption]})
    @photo.write_iptc_metadata
    @photo.recalculate_checksum # integrity verification fails since upgrading to rails 7

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

  def update
    @photo = Photo.find(params[:id])
    authorize @photo
    @photo.update(photo_params)
    @photo.write_iptc_metadata

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
    authorize @photo
    @photo.destroy
    clear_cache @photo.interview

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def photo_params
    params.require(:photo).permit(
      :interview_id,
      :public_id,
      :workflow_state,
      translations_attributes: [:locale, :id, :caption, :place, :date, :photographer, :license]
    )
  end

end
