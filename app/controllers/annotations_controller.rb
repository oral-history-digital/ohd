class AnnotationsController < ApplicationController

  layout 'responsive'

  def create
    policy_scope(Annotation)
    @annotation = Annotation.new(annotation_params)
    @annotation.author_id = current_user_account.user.id
    @annotation.save
    #@annotation.submit! if @annotation.private? && params[:publish]

    clear_cache @annotation.segment
    Rails.cache.delete "interview-segments-#{@annotation.interview_id}-#{@annotation.interview.segments.maximum(:updated_at)}" 

    respond_to do |format|
      format.json do
        # annotation is nested too deep, so we return the associated and updated segment
        json = {
          archive_id: @annotation.segment.interview.archive_id,
          data_type: 'interviews',
          nested_data_type: 'segments',
          nested_id: @annotation.segment_id,
          extra_id: @annotation.segment.tape.number,
          data: ::SegmentSerializer.new(@annotation.segment).as_json
        }
        render json: json
      end
    end
  end

  def update
    @annotation = Annotation.find params[:id]
    authorize @annotation
    @annotation.update_attributes annotation_params

    clear_cache @annotation.segment
    Rails.cache.delete "interview-segments-#{@annotation.interview_id}-#{@annotation.interview.segments.maximum(:updated_at)}" 

    respond_to do |format|
      format.json do
        # annotation is nested too deep, so we return the associated and updated segment
        render json: {
          archive_id: @annotation.segment.interview.archive_id,
          data_type: 'interviews',
          nested_data_type: 'segments',
          nested_id: @annotation.segment_id,
          extra_id: @annotation.segment.tape.number,
          data: ::SegmentSerializer.new(@annotation.segment).as_json
        }
      end
    end
  end

  def destroy 
    @annotation = Annotation.find(params[:id])
    authorize @annotation
    @annotation.destroy

    clear_cache @annotation.segment
    Rails.cache.delete "interview-segments-#{@annotation.interview_id}-#{@annotation.interview.segments.maximum(:updated_at)}" 

    respond_to do |format|
      format.json do
        # annotation is nested too deep, so we return the associated and updated segment
        render json: {
          archive_id: @annotation.segment.interview.archive_id,
          data_type: 'interviews',
          nested_data_type: 'segments',
          nested_id: @annotation.segment_id,
          extra_id: @annotation.segment.tape.number,
          data: ::SegmentSerializer.new(@annotation.segment).as_json
        }
      end
    end
  end

  private

  def annotation_params
    params.require(:annotation).permit(:text, :segment_id, :interview_id)
  end
end
