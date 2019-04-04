class SegmentsController < ApplicationController

  layout 'responsive'

  #def new
    #respond_to do |format|
      #format.html { render 'react/app' }
      #format.json { render json: {}, status: :ok }
    #end
  #end

  #def create
    #@segment = Segment.create segment_params
    #respond_to do |format|
      #format.json do
        #render json: {
          #id: @segment.id,
          #data_type: 'segments',
          #data: ::SegmentSerializer.new(@segment).as_json,
        #}
      #end
    #end
  #end

  def update
    @segment = Segment.find params[:id]
    authorize @segment
    # set headings like this, because blank values won`t be transmitted in params
    # nulling a heading therefore would not be possible
    #
    #@segment.mainheading = segment_params[:mainheading]
    #@segment.subheading = segment_params[:subheading]
    #@segment.text = segment_params[:text]
    #@segment.speaker_id = segment_params[:speaker_id]
    #@segment.save
    @segment.update_attributes(segment_params)

    clear_cache @segment
    #if @segment.mainheading || @segment.subheading || segment_params[:mainheading] || segment_params[:subheading]
      #Rails.cache.delete "#{Project.cache_key_prefix}-headings-#{@segment.id}-#{@segment.updated_at}"
    #end

    respond_to do |format|
      format.json do
        render json: {
          archive_id: @segment.interview.archive_id,
          data_type: 'interviews',
          nested_data_type: 'segments',
          nested_id: @segment.id,
          extra_id: @segment.tape.number,
          data: cache_single(@segment),
          reload_data_type: 'headings',
          reload_id: "for_interviews_#{@segment.interview.archive_id}"
        }
      end
    end
  end

  def index
    @interview = Interview.find_by_archive_id(params[:interview_id])
    policy_scope(Segment)
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch("#{Project.cache_key_prefix}-interview-segments-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}") do
          {
            data: @interview.tapes.inject({}) do |tapes, t|
              segments_for_tape = Segment.
                includes(:translations, :registry_references, :user_annotations, annotations: [:translations]).
                for_interview_id(@interview.id).
                where(tape_id: t.id).
                where.not(timecode: '00:00:00.000')#.first(20)

              tapes[t.number] = segments_for_tape.inject({}){|mem, s| mem[s.id] = cache_single(s); mem}
              tapes
            end,
            nested_data_type: 'segments',
            data_type: 'interviews',
            archive_id: params[:interview_id]
          }
        end
        render json: json
      end
    end
  end

  #def destroy 
    #@segment = Segment.find(params[:id])
    #@segment.destroy

    #respond_to do |format|
      #format.html do
        #render :action => 'index'
      #end
      #format.js
      #format.json { render json: {}, status: :ok }
    #end
  #end

  def show
    @segment = Segment.find(params[:id])
    authorize @segment
    respond_to do |format|
      format.json do
        render json: data_json(@segment)
      end
    end
  end

  private

  def segment_params
    params.require(:segment).permit(:text, :mainheading, :subheading, :speaker_id)
  end
end
