class UserAccount < AuthenticationModel

  devise :database_authenticatable,
         :recoverable,
         :confirmable,
         :rememberable,
         :recoverable,
         :trackable

  has_many :authenticatables

  attr_accessible :email, :login, :password, :password_confirmation, :remember_me

  validates_uniqueness_of :login
  validates_uniqueness_of :email
  validates_presence_of :login

end