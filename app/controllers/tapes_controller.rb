class TapesController < BaseController

  before_filter :parent_object

  def playlist_high
    @interview = parent_object
    @tapes = @interview.tapes
  end

  def transcript
    @tape = object
  end

  private

  def parent_object
    @interview = Interview.find_by_archive_id(params[:interview_id])
  end

  def object
    super
    @interview = parent_param.blank? ? (@object.blank? ? nil : @object.interview) : parent_object
    @object
  end

end