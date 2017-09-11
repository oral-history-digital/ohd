class SegmentsController < ApplicationController

  def index
    segments = Segment.
      includes(:translations, :annotations => [:translations], registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
      for_interview_id(params[:interview_id])
    headings = segments.with_heading
    respond_to do |format|
      format.json do 
        render json: {
          segments: segments.map{|s| ::SegmentSerializer.new(s)},
          headings: headings.map{|s| ::SegmentSerializer.new(s)},
        }
      end
    end
  end

  #convert seconds to hh:mm:ss
  #Time.at(t).utc.strftime("%H:%M:%S")
  #convert hh:mm:ss to seconds
  #Time.parse("10:30").seconds_since_midnight
end
