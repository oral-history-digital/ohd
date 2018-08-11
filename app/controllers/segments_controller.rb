class SegmentsController < BaseController

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
          #data: ::SegmentSerializer.new(@segment),
        #}
      #end
    #end
  #end

  def update
    @segment = Segment.find params[:id]
    @segment.update_attributes segment_params

    clear_cache @segment
    Rails.cache.delete "headings-#{@segment.id}-#{@segment.updated_at}"

    respond_to do |format|
      format.json do
        render json: {
          archive_id: @segment.interview.archive_id,
          data_type: 'interviews',
          nested_data_type: 'segments',
          nested_id: @segment.id,
          extra_id: @segment.tape.number,
          data: ::SegmentSerializer.new(@segment)
        }
      end
    end
  end

  def index
    @interview = Interview.find_by_archive_id(params[:interview_id])
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "interview-segments-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}" do
          {
            data: @interview.tapes.inject({}) do |tapes, t|
              segments_for_tape = Segment.
                includes(:translations, :annotations => [:translations]).
                for_interview_id(@interview.id).
                where(tape_id: t.id).
                where.not(timecode: '00:00:00.000')

              tapes[t.number] = segments_for_tape.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("segment-#{s.id}-#{s.updated_at}"){::SegmentSerializer.new(s).as_json}; mem}
              tapes
            end,
            nested_data_type: 'segments',
            data_type: 'interviews',
            archive_id: params[:interview_id]
          }
        end.to_json
        render plain: json
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

  private

  def segment_params
    params.require(:segment).permit(:text, :mainheading, :subheading)
  end
end
