class CollectionPolicy < ApplicationPolicy
  def show?
    return true if user&.admin?
    return false unless visible_project?(record.project_id)

    # Anonymous users can never access unshared collections.
    return record.workflow_state != 'unshared' unless user

    true
  end

  class Scope < Scope
    def resolve
      return scope.all if user&.admin?

      visible = scope.where(project_id: visible_project_ids)

      # Anonymous users can browse only public/restricted collections.
      return visible.where.not(workflow_state: 'unshared') unless user

      visible
    end

    private

    def visible_project_ids
      base_scope = Project.all
      public_scope = base_scope.where(workflow_state: 'public')
      return public_scope.select(:id) unless user

      granted_project_ids = user.user_projects
        .where(workflow_state: 'project_access_granted')
        .select(:project_id)

      role_project_ids = user.roles.select(:project_id)

      public_scope
        .or(base_scope.where(id: granted_project_ids))
        .or(base_scope.where(id: role_project_ids))
        .select(:id)
    end
  end

  private

  def visible_project?(project_id)
    base_scope = Project.all
    return base_scope.where(id: project_id, workflow_state: 'public').exists? unless user
    return true if user&.admin?

    base_scope.where(id: project_id, workflow_state: 'public').exists? ||
      user.user_projects.where(workflow_state: 'project_access_granted', project_id: project_id).exists? ||
      user.roles.where(project_id: project_id).exists?
  end
end
