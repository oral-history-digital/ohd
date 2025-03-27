class Role < ApplicationRecord
  has_many :role_permissions, dependent: :destroy
  has_many :permissions, through: :role_permissions

  has_many :user_roles, dependent: :destroy
  has_many :users, through: :user_roles

  belongs_to :project

  translates :name, fallbacks_for_empty_translations: true
end
