class CommentPolicy < ApplicationPolicy

  def create?
    user.admin? || user.permissions?('Comment', :create) || user.all_tasks.find{|t| record == t}
  end

  def update?
    user.admin? || user.permissions?('Comment', :update) || user.all_tasks.find{|t| record.ref == t}
  end

  def destroy?
    update?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end
