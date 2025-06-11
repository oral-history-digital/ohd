class InterviewPermissionPolicy < ApplicationPolicy

  def create?
    user && (user.admin? || user.permissions.map(&:klass).include?('User'))
  end

  def destroy?
    create?
  end

end

