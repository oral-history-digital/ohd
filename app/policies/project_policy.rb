class ProjectPolicy < ApplicationPolicy

  def show?
    return true if record.is_a?(Class) # Return early for class-level checks
    return true if user&.admin?
    return true if record.workflow_state == 'public'
    return false unless user

    user.user_projects.where(workflow_state: 'project_access_granted', project_id: record.id).exists? ||
      user.roles.where(project_id: record.id).exists?
  end

  class Scope < Scope
    def resolve
      base_scope = scope.all
      return base_scope if user&.admin?

      public_scope = base_scope.where(workflow_state: 'public')
      return public_scope unless user

      granted_project_ids = user.user_projects
        .where(workflow_state: 'project_access_granted')
        .select(:project_id)

      role_project_ids = user.roles.select(:project_id)

      public_scope
        .or(base_scope.where(id: granted_project_ids))
        .or(base_scope.where(id: role_project_ids))
    end
  end

  %w(create destroy).each do |m|
    define_method "#{m}?" do
      user && user.admin?
    end
  end

  def cmdi_metadata?
    show?
  end

  def archiving_batches_index?
    show?
  end

  def archiving_batches_show?
    show?
  end

  def edit_info?
    update?
  end

  def edit_display?
    update?
  end

  def edit_config?
    update?
  end

  def edit_access_config?
    update?
  end

  Project.non_public_method_names.each do |m|
    define_method "#{m}?" do
      update?
    end
  end
end
