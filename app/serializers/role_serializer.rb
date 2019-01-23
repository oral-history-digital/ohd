class RoleSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :desc,
    :permissions,
    :created_at

  def permissions
    object.user.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  end

  def created_at
    object.created_at && object.created_at.strftime('%d.%m.%Y %M:%H Uhr')
  end

end
