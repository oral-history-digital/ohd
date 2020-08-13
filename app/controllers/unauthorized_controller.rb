class UnauthorizedController < ActionController::Metal
  include AbstractController::Rendering
  include ActionController::Rendering
  include ActionController::Renderers

  use_renderers :json

  def self.call(env)
    #raise "unauthorized"
    render json: {error: 'registration_needed'}
    #respond_to do |format|
      #format.html {}
      #render json: {error: 'registration_needed'}
    #end
    #@respond ||= action(:respond)
    #@respond.call(env)
  end

  def respond
    head :unauthorized
  end
end
