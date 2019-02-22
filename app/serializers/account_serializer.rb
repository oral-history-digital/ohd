class AccountSerializer < ActiveModel::Serializer
  attributes :id,
    :email,
    :login,
    :first_name,
    :last_name,
    :user_id,
    #:organization,
    #:homepage,
    #:street,
    #:zipcode,
    #:city,
    #:state,
    #:country,
    #:receive_newsletter,
    #:newsletter_signup,
    :admin

  has_many :tasks
  has_many :supervised_tasks
  has_many :permissions
  has_many :roles

  def first_name
    object.user && object.user.first_name
  end

  def last_name
    object.user && object.user.last_name
  end

  def admin
    object.user && object.user.admin
  end

  def user_id
    object.user.id
  end

end
