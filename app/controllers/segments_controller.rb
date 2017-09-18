class SegmentsController < ApplicationController

  def index
    json = Rails.cache.fetch "segments-headings-for-#{params[:interview_id]}" do
      interview = Interview.find_by(archive_id: params[:interview_id])
      segments = Segment.
        includes(:translations, :annotations => [:translations], registry_references: {registry_entry: {registry_names: :translations}, registry_reference_type: {} } ).
        for_interview_id(interview.id)
      headings = segments.with_heading
      {
        interview: ::InterviewSerializer.new(interview),
        segments: segments.map{|s| ::SegmentSerializer.new(s)},
        headings: headings.map{|s| ::SegmentSerializer.new(s)},
      }
    end
    respond_to do |format|
      format.json do 
        render json: json
      end
    end
  end

  #convert seconds to hh:mm:ss
  #Time.at(t).utc.strftime("%H:%M:%S")
  #convert hh:mm:ss to seconds
  #Time.parse("10:30").seconds_since_midnight
end
