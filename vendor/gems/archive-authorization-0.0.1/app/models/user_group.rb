class UserGroup < ActiveRecord::Base

  has_many  :users_user_groups

  has_many  :users,
            :through => :users_user_groups

  has_many  :roles

  belongs_to :supervisor,
             :class_name => 'User'

end