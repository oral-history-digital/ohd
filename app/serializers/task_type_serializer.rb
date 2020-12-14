class TaskTypeSerializer < ApplicationSerializer

  attributes :id,
    :label,
    :name,
    :key,
    :abbreviation,
    :use,
    :task_type_permissions,
    :project_id,
    :created_at

  def label
    object.localized_hash(:label)
  end

  def name
    label
  end

  def task_type_permissions
    object.task_type_permissions.inject({}){|mem, c| mem[c.id] = TaskTypePermissionSerializer.new(c); mem}
  end

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %H:%M Uhr')
  end

end
