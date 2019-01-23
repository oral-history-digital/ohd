class TaskPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user: user).or.where(supervisor: user)
    end
  end
end
