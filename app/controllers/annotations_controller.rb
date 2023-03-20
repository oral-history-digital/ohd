class AnnotationsController < ApplicationController
  def create
    authorize Annotation
    @annotation = Annotation.new(annotation_params)
    @annotation.author_id = current_user.id # FIXME: if we have data here (in MOG for example), it has to be migrated from user_id to user_account_id
    @annotation.save
    #@annotation.submit! if @annotation.private? && params[:publish]

    @annotation.segment.touch

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
    @annotation.update annotation_params

    @annotation.segment.touch

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
    segment = @annotation.segment
    @annotation.destroy
    segment.touch

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
    params.require(:annotation).permit(:text, :segment_id, :interview_id, :locale)
  end
end
