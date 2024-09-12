class SegmentsController < ApplicationController
  def update
    @segment = Segment.find params[:id]
    authorize @segment
    @segment.update(segment_params)
    @segment.update_has_heading
    @segment.reload

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
        data = Rails.cache.fetch("#{current_project.shortname}-interview-segments-#{@interview.id}-#{@interview.segments.maximum(:updated_at)}") do
          transcript_coupled = @interview.transcript_coupled
          @interview.tapes.inject({}) do |tapes, tape|
            segments_for_tape = tape.segments.
              includes(:translations, :registry_references, :user_annotations, annotations: [:translations]).
              #includes(:interview, :tape, :translations, :registry_references, :user_annotations, annotations: [:translations], speaking_person: [:translations], project: [:metadata_fields]).
              #where.not(timecode: '00:00:00.000').
              order(:timecode)#.first(20)

            tapes[tape.number] = segments_for_tape.inject({}){|mem, s| mem[s.id] = cache_single(s, transcript_coupled: transcript_coupled); mem}
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
