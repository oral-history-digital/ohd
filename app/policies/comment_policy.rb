class CommentPolicy < ApplicationPolicy

  def create?
    user.admin? || user.permissions?('Comment', :create) || user.tasks?(record.ref)
  end

  def update?
    create?
  end

  def destroy?
    create?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
