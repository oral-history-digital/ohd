class ApplicationPolicy
  attr_reader :user, :record, :project

  def initialize(project_context, record)
    @user = project_context.user
    @project = project_context.project
    @record = record
  end

  def index?
    user.present?
  end

  def show?
    true
  end

  %w(create new update edit destroy download upload_transcript).each do |m|
    define_method "#{m}?" do
      user && (user.admin? || user.roles?(project, resolve_class_name(record), m) || user.task_permissions?(project, record, m))
    end
  end

  class Scope
    attr_reader :user, :scope, :project

    def initialize(project_context, scope)
      @user = project_context.user
      @project = project_context.project
      @scope = scope
    end

    def resolve
      if project && scope.attribute_names.include?('project_id')
        scope.where(project_id: project.id)
      elsif project && scope.attribute_names.include?('interview_id')
        scope.joins(:interview).where("interviews.project_id = ?", project.id)
      else
        scope.all
      end
    end
  end

  private
    def resolve_class_name(record)
      record.respond_to?(:class_name) ? record.class_name : record.class.name
    end
end
