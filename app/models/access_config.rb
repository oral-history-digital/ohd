class AccessConfig < ApplicationRecord
  belongs_to :project, touch: true

  serialize :organization
  serialize :job_description
  serialize :research_intentions
  serialize :specification
  serialize :tos_agreement

  before_create :set_default_properties
  def set_default_properties
    self.organization = {
      display: true,
      obligatory: true,
    }
    self.job_description = {
      display: true,
      obligatory: true,
      values: {
        researcher: true,
        filmmaker: true,
        journalist: true,
        teacher: true,
        memorial_staff: true,
        pupil: true,
        student: true,
        other: true,
      },
    }
    self.research_intentions = {
      display: true,
      obligatory: true,
      values: {
        exhibition: true,
        education: true,
        film: true,
        memorial_culture_project: true,
        genealogy: true,
        art: true,
        personal_interest: true,
        press_publishing: true,
        school_project: true,
        university_teaching: true,
        scientific_paper: true,
        other: true,
      },
    }
    self.specification = {
      display: true,
      obligatory: true,
    }
    self.tos_agreement = {
      display: true,
      obligatory: true,
    }
  end

  %w(organization job_description research_intentions specification tos_agreement).each do |field|
    define_method "#{field}_setter=" do |hash|
      hash = hash.with_indifferent_access
      self[field][:display] = hash[:display] || self[field][:display]
      self[field][:obligatory] = hash[:obligatory] || self[field][:obligatory]
      if hash[:values]
        self[field][:values].update(hash[:values])
      end
    end
  end

end
