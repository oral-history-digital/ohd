class ContributionTypeSerializer < ApplicationSerializer
  attributes :id, :label, :name, :code, :project_id, :use_in_details_view, :use_in_export, :order

  def label
    object.localized_hash(:label)
  end

  def name
    object.localized_hash(:label)
  end

end
