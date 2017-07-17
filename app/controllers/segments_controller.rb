class SegmentsController < ApplicationController

  def index
    segments = Segment.for_interview_id(params[:interview_id])#.paginate page: 1
    respond_to do |format|
      format.json{ render json: segments.to_json }
    end
  end

  #convert seconds to hh:mm:ss
  #Time.at(t).utc.strftime("%H:%M:%S")
  #convert hh:mm:ss to seconds
  #Time.parse("10:30").seconds_since_midnight
end
