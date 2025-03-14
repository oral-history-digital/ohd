class TapesController < ApplicationController

  before_action :parent_object

  def playlist
    @interview = parent_object
    @tapes = @interview.tapes
  end

  def transcript
    @tape = object
  end

  private

  def parent_object
    @interview = Interview.find_by_archive_id(params[:interview_id], :include => :translations)
  end

  def object
    super
    @interview = parent_param.blank? ? (@object.blank? ? nil : @object.interview) : parent_object
    @object
  end

end
