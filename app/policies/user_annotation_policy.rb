class UserAnnotationPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user_id: user.id)
    end
  end

  def create?
    !user.nil?
  end

  def update?
    user.admin? || user.user_contents.include?(record)
  end

  def destroy?
    update?
  end
end
