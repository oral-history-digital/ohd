class WebNotificationsChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user_account
  end
end
