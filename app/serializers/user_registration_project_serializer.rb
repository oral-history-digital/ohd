class UserRegistrationProjectSerializer < ApplicationSerializer
  attributes :id,
    :project_id,
    :user_registration_id,
    :activated_at

  def activated_at
    object.activated_at && object.activated_at.strftime("%d.%m.%Y %H:%M")
  end
end
