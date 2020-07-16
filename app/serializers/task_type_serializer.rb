class TaskTypeSerializer < ApplicationSerializer

  attributes :id,
    :name,
    :key,
    :use,
    :project_id

  def name
    object.localized_hash(:label)
  end

end
