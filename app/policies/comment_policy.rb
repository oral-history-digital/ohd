class CommentPolicy < ApplicationPolicy

  def create?
    user.admin? || user.permissions?('Comment', :create) || user.all_tasks.find{|t| record.ref.interview_id == t.interview_id}
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
