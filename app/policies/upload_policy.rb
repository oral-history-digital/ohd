class UploadPolicy < Struct.new(:user, :upload)
  attr_reader :user, :upload

  def initialize(user, upload)
    @user = user
    @upload = upload
  end

  def new?
    user.admin?
  end

  def create?
    new?
  end

end
