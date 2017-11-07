class UserAccountSerializer < ActiveModel::Serializer
  attributes :id,
    :email,
    :login,
    :first_name,
    :last_name

  def first_name
    object.user && object.user.first_name
  end

  def last_name
    object.user && object.user.last_name
  end

end
