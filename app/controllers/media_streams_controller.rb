class MediaStreamsController < ApplicationController

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
      format.json { render json: data_json(ref, msg: 'processed') }
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
      :project_id
    )
  end

end
