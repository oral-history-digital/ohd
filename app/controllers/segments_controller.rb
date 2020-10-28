class SegmentsController < ApplicationController
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
    @segment.update_original_and_write_other_versions(segment_params)

    #if @segment.mainheading || @segment.subheading || segment_params[:mainheading] || segment_params[:subheading]
      #Rails.cache.delete "#{current_project.cache_key_prefix}-headings-#{@segment.id}-#{@segment.updated_at}"
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
        data = Rails.cache.fetch("#{current_project.cache_key_prefix}-interview-segments-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}") do
          @interview.tapes.inject({}) do |tapes, tape|
            segments_for_tape = tape.segments.
              includes(:translations, :registry_references, :user_annotations, annotations: [:translations], speaking_person: [:translations]).
              where.not(timecode: '00:00:00.000').order(:timecode)#.first(20)

            tapes[tape.number] = segments_for_tape.inject({}){|mem, s| mem[s.id] = cache_single(s); mem}
            tapes
          end
        end
        json = {
          data: data,
          nested_data_type: 'segments',
          data_type: 'interviews',
          archive_id: params[:interview_id]
        }
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
    params.require(:segment).permit(
      :text,
      :mainheading,
      :subheading,
      :speaker_id,
      :locale,
      translations_attributes: [:locale, :text, :id, :mainheading, :subheading]
    )
  end
end
