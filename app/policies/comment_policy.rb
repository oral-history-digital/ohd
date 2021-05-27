class CommentPolicy < ApplicationPolicy

  def create?
    user.admin? || user.roles?(project, 'Comment', 'create') || user.all_tasks.find{|t| record == t}
  end

  def update?
    user.admin? || user.roles?(project, 'Comment', 'update') || user.all_tasks.find{|t| record.ref == t}
  end

  def destroy?
    update?
  end

  class Scope
    def resolve
      if user.admin?
        scope.all
      else
        scope.where(ref_id: [user.all_tasks.map(&:id)])
      end
    end
  end
end
