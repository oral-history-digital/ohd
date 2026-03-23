class InstitutionProject < ApplicationRecord
  belongs_to :institution, touch: true
  belongs_to :project, touch: true

  after_commit :refresh_institution_counters

  private

  def refresh_institution_counters
    impacted_institutions.each do |inst|
      inst.update_projects_count
      inst.update_interviews_count
      inst.touch
    end
  end

  # Get institution of the link and its parent, if it exists.
  def impacted_institutions
    own_institution = Institution.find_by(id: institution_id)
    [own_institution, own_institution&.parent].compact.uniq
  end
end
