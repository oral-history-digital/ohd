class ContributionType < ApplicationRecord
  belongs_to :project, touch: true
  has_many :contributions

  validates_uniqueness_of :code, :scope => [ :project_id ]

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  after_update :touch_contributions
  def touch_contributions
    contributions.update_all updated_at: Time.now
    project.interviews.update_all updated_at: Time.now
  end

end
