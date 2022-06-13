class PhotosController < ApplicationController
  require 'open-uri'

  def create
    authorize Photo
    data = params[:photo].delete(:data)
    @photo = Photo.create(photo_params)
    @photo.photo.attach(io: data, filename: "#{@photo.interview.archive_id.upcase}_#{str = format('%02d', @photo.interview.photos.count)}", metadata: {title: photo_params[:caption]})
    write_iptc_metadata

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
    @photo.update_attributes(photo_params)
    write_iptc_metadata

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

  def write_iptc_metadata
    if photo_params[:translations_attributes].blank?
      return
    end

    date = photo_params[:translations_attributes].map{|t| Date.parse(t[:date]).strftime("%Y%m%d") rescue t[:date]}.join(' ')

    WriteImageIptcMetadataJob.perform_later(@photo.id, {
      caption: photo_params[:translations_attributes].map{|t| t[:caption]}.join(' '),
      creator: photo_params[:translations_attributes].map{|t| t[:photographer]}.join(' '),
      headline: "#{@photo.interview.archive_id}-Interview mit #{@photo.interview.short_title(locale)}",
      copyright: photo_params[:translations_attributes].map{|t| t[:license]}.join(' '),
      date: date,
      city: photo_params[:translations_attributes].map{|t| t[:place]}.join(' ')
    })
  end

end
