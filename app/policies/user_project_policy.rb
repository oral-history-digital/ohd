class UserProjectPolicy < ApplicationPolicy
  def create?
    user
  end
end
