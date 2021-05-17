class UploadPolicy < Struct.new(:project_context, :upload)

  def create?
    project_context.user.admin? || project_context.user.roles?(project_context.project, 'Upload', "create")
  end

  def new?
    create?
  end

end
