class Institution < ApplicationRecord
  has_many :logos, as: :ref, dependent: :destroy
  belongs_to :parent, class_name: 'Institution'
  has_many :institution_projects, dependent: :destroy
  has_many :projects, through: :institution_projects
  has_many :collections

  translates :name, :description, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  def num_projects
    projects.shared.count
  end

  def num_interviews
    # TODO: This only works with two-level-hierarchies.
    all_interviews = Institution.where(id: id)
      .or(Institution.where(parent_id: id))
      .joins(projects: :interviews)
      .where('projects.workflow_state': 'public')
      .where('interviews.workflow_state': 'public')
      .select(:archive_id)
      .distinct
      .count
  end
end
