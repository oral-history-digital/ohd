class TaskTypeSerializer < ApplicationSerializer

  attributes :id,
    :name,
    :key,
    :abreviation,
    :use,
    :project_id

  def name
    object.localized_hash(:label)
  end

end
