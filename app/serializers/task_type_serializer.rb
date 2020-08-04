class TaskTypeSerializer < ApplicationSerializer

  attributes :id,
    :label,
    :name,
    :key,
    :abbreviation,
    :use,
    :project_id

  def label
    object.localized_hash(:label)
  end

  def name
    label
  end

end
