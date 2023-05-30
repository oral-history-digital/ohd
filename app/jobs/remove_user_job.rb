class RemoveUserJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    user.destroy
  end
end

