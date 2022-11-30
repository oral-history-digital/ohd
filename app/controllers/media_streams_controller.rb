class MediaStreamsController < ApplicationController
  require 'open-uri'

  def show
    interview = Interview.find_by_archive_id(params[:archive_id])
    authorize interview
    url = current_project.media_streams.where(resolution: params[:resolution]).first.path.
      gsub('INTERVIEW_ID', interview.archive_id).
      gsub('TAPE_COUNT', format('%02d', interview.tape_count.to_s)).
      gsub('TAPE_NUMBER', format('%02d', params[:tape].to_s))

    redirect_to url, allow_other_host: true
  end

  def hls
    authorize MediaStream, :hls?
    respond_to do |format|
      format.key do
        send_file File.join(Rails.root, 'config', 'hls', 'file_single_encryption.key'), filename: 'hls.key'
      end
    end
  end

  def create
    authorize MediaStream
    @media_stream = MediaStream.create(media_stream_params)

    respond @media_stream
  end

  def update
    @media_stream = MediaStream.find(params[:id])
    authorize @media_stream
    @media_stream.update_attributes(media_stream_params)
    respond @media_stream
  end

  def destroy
    @media_stream = MediaStream.find(params[:id])
    authorize @media_stream
    @media_stream.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    policy_scope(MediaStream)
    respond_to do |format|
      format.html { render 'react/app' }
    end
  end

  private

  def respond media_stream
    Interview.update_all(updated_at: Time.current)

    respond_to do |format|
      format.json do
        render json: {
          nested_data_type: 'media_streams',
          nested_id: media_stream.id,
          data: ::MediaStreamSerializer.new(media_stream).as_json,
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def media_stream_params
    params.require(:media_stream).permit(
      :id,
      :media_type,
      :path,
      :resolution,
      :tape,
      :archive_id,
      :project_id
    )
  end

end
