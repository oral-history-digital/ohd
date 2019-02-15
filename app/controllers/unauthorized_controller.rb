class UnauthorizedController < ActionController::Metal
  include ActionController::Rendering

  def self.call(env)
    raise "unauthorized"
    #@respond ||= action(:respond)
    #@respond.call(env)
  end

  def respond
    #head :unauthorized
  end
end
