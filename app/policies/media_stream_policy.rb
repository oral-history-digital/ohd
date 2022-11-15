class MediaStreamPolicy < ApplicationPolicy
  def hls?
    user.present?
  end
end
