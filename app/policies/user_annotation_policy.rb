class UserAnnotationPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user_account_id: user.id) 
    end
  end
end
