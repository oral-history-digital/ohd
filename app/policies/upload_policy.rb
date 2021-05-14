class UploadPolicy < Struct.new(:user, :upload)

  def create?
    user.admin? || user.roles?(project, 'Upload', "create")
  end

  def new?
    create?
  end

end
