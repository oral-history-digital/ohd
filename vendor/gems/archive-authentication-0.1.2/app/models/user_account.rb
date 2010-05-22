class UserAccount < AuthenticationModel

  devise :database_authenticatable,
         :recoverable,
         :confirmable,
         :rememberable,
         :recoverable,
         :trackable

  has_many :authenticatables

  attr_accessible :email, :password, :password_confirmation, :remember_me

end