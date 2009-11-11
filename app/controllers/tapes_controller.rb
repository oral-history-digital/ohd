class TapesController < BaseController

  def playlist_high
    @tapes = Interview.find(params[:interview_id]).tapes
  end

  def transcript
    @tape = object
  end

end