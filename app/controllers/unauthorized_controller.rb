class UnauthorizedController < ActionController::Metal
  include AbstractController::Rendering
  include ActionController::Rendering
  include ActionController::Renderers

  use_renderers :json

  def self.call(env)
    @respond ||= action(:respond)
    @respond.call(env)
  end

  def respond
    render json: {error: 'registration_needed'}
  end
end
