class UploadPolicy < Struct.new(:user, :upload)
  attr_reader :user, :upload

  def initialize(user, upload)
    @user = user
    @upload = upload
  end

  def create?
    user.admin? || user.permissions?('Upload', "create") 
  end

  def new?
    create?
  end

end
