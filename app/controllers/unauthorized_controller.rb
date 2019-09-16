class UnauthorizedController < ActionController::Metal
  include ActionController::Rendering

  respond_to :json, :html

  def self.call(env)
    #raise "unauthorized"
    render json: {error: 'registration_needed'}
    #@respond ||= action(:respond)
    #@respond.call(env)
  end

  def respond
    head :unauthorized
  end
end
