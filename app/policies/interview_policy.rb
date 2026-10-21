class InterviewPolicy < ApplicationPolicy

  def dois?
    create?
  end

  def doi_contents?
    show?
  end

  def speaker_designations?
    dois?
  end

  def ref_tree?
    show?
  end

  def headings?
    show?
  end

  def update_speakers?
    dois?
  end

  def mark_texts?
    dois?
  end

  def reload_translations?
    user
  end

  # Requires login and access to the interview's protected contents for exports.
  #
  # @return [Boolean, nil] Whether a transcript may be exported
  def transcript?
    user && content?
  end

  def observations?
    transcript?
  end

  def export_photos?
    download?
  end

  def export_all?
    download?
  end

  def tei?
    download?
  end

  def restricted?
    user && (user.accessible_projects.include?(project) || user.admin?)
  end

  # Authorizes searchable contents independently of discovery metadata.
  #
  # @return [Boolean] Whether the interview's contents may be searched
  def search_fulltext?
    content?
  end

  # Authorizes protected contents within the current project context.
  #
  # @return [Boolean] Whether the interview's contents may be accessed
  def content?
    Scope.new(ProjectContext.new(user, project), Interview).search_fulltext.exists?(record.id)
  end

  # Keeps content-search permissions separate from the inherited discovery scope.
  class Scope < ApplicationPolicy::Scope
    # Restricts content searches to the request context and owning-project grants.
    # InterviewPermission records are grants; access requests do not create them.
    #
    # @return [ActiveRecord::Relation<Interview>] Interviews with searchable contents
    def search_fulltext
      return scope.none unless project

      projects = ProjectPolicy::Scope.new(ProjectContext.new(user, project), Project).resolve
      projects = projects.where(id: project.id) unless project.umbrella?
      visible = scope.where(project_id: projects.select(:id))
      return visible if user&.admin?

      accessible_ids = user ? user.accessible_projects.map(&:id) : Project.where(grant_access_without_login: true).pluck(:id)
      accessible = visible.where(project_id: accessible_ids)
      public_interviews = accessible.where(workflow_state: 'public')
      return public_interviews unless user

      editorial_roles = user.roles.joins(:permissions)
      editorial_project_ids = editorial_roles.where(permissions: { klass: 'General', action_name: 'edit' })
        .or(editorial_roles.where(permissions: { klass: 'Interview', action_name: 'show' })).select(:project_id)
      task_interview_ids = Task.joins(:permissions)
        .where('tasks.user_id = :id OR tasks.supervisor_id = :id', id: user.id)
        .where(permissions: { klass: 'Interview', action_name: 'show' }).select(:interview_id)

      public_interviews
        .or(accessible.where(workflow_state: 'restricted', id: user.interview_permissions.select(:interview_id)))
        .or(visible.where(project_id: editorial_project_ids))
        .or(accessible.where(id: task_interview_ids))
    end
  end

  Interview.non_public_method_names.each do |m|
    define_method "#{m}?" do
      restricted? || (user&.accessible_projects.include?(project) || record.workflow_state == 'public')
    end
  end

end
