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
    }
    self.job_description = {
      display: true,
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
      values: {
        exhibition: true,
        education: true,
        film: true,
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
    }
    self.tos_agreement = {
      display: true,
    }
  end

  %w(organization job_description research_intentions specification tos_agreement).each do |field|
    define_method "#{field}=?" do |params_hash|
      display = params_hash.delete(:display) || field[:display]
      self[field][display] = display
      if params_hash[:values]
        self[field][:values].with_indifferent_access.update(params_hash[:values].with_indifferent_access)
      end
    end
  end

end
