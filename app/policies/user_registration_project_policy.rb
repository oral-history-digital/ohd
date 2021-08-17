class UserRegistrationProjectPolicy < ApplicationPolicy
  def create?
    user
  end
end
