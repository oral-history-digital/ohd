class UserAccountSerializer < ActiveModel::Serializer
  attributes :id,
    :email,
    :login,
    :first_name,
    :last_name,
    :admin,
    :permissions,
    :tasks

  has_many :tasks#, serializer: TaskSerializer
  has_many :permissions#, serializer: TaskSerializer

  def first_name
    object.user && object.user.first_name
  end

  def last_name
    object.user && object.user.last_name
  end

  def admin
    object.user && object.user.admin
  end

end
