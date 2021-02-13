class ContributionTypeSerializer < ApplicationSerializer
  attributes :id, :label, :name, :code, :project_id

  def label
    object.localized_hash(:label)
  end

  def name
    object.localized_hash(:label)
  end

end
