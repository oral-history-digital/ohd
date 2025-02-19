class RemoveUserJob < ApplicationJob
  queue_as :default

  def perform(opts)
    user = User.find(opts[:user_id])
    user.destroy
  end
end

