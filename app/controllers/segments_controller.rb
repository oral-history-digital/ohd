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
          data: cache_single(@segment, allowed_to_see_all: true),
          reload_data_type: 'headings',
          reload_id: "for_interviews_#{@segment.interview.archive_id}"
        }
      end
    end
  end

  def index
    @interview = Interview.find_by_archive_id(params[:interview_id])

    respond_to do |format|
      format.json do
        json = {
          data: policy_scope(@interview.segments.first || Segment.new(interview: @interview)),
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
    required = params.require(:segment)
    dynamic_keys = required.keys.grep(/^text_/)

    required.permit(
      :text,
      :mainheading,
      :subheading,
      :speaker_id,
      :locale,
      *dynamic_keys,
      translations_attributes: [:locale, :text, :id, :mainheading, :subheading],
    )
  end
end
