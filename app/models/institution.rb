class Institution < ApplicationRecord
  has_many :logos, as: :ref, dependent: :destroy
  belongs_to :parent, class_name: 'Institution'
  has_many :projects, through: :institution_projects
end
