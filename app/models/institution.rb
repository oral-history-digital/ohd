class Institution < ApplicationRecord
  has_many :logos, as: :ref, dependent: :destroy
  belongs_to :parent, class_name: 'Institution'
  has_many :institution_projects
  has_many :projects, through: :institution_projects
  has_many :collections

  translates :name, :description, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
end
