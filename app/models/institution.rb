class Institution < ApplicationRecord
  has_many :logos, as: :ref, dependent: :destroy
  belongs_to :parent, class_name: 'Institution'
  has_many :children, class_name: 'Institution', foreign_key: 'parent_id', dependent: :destroy
  has_many :institution_projects, dependent: :destroy
  has_many :projects, through: :institution_projects
  has_many :interviews, ->{ where("projects.workflow_state = 'public'") }, through: :projects
  has_many :collections

  translates :name, :description, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  def num_projects
    projects_count
  end

  def num_interviews
    interviews_count
  end

  def update_interviews_count
    # Note: This only works with two-level-hierarchies.
    projects_of_institution = Project
      .select(:id, :shortname, :interviews_count)
      .joins(:institutions)
      .where("institutions.id = ?", self.id)
      .where(workflow_state: 'public')

    projects_of_children = Project
      .select(:id, :shortname, :interviews_count)
      .joins("INNER JOIN institution_projects ip ON ip.project_id = projects.id")
      .joins("INNER JOIN institutions children ON children.id = ip.institution_id")
      .joins("INNER JOIN institutions parent ON parent.id = children.parent_id")
      .where("parent.id = ?", self.id)
      .where(workflow_state: 'public')

    combined = projects_of_institution.to_a.concat(projects_of_children).uniq
    sum = combined.inject(0) { |agg, project| agg + project.interviews_count }
    self.interviews_count = sum
    self.save
  end
end
