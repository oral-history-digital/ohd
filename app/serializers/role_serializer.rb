class RoleSerializer < ActiveModel::Serializer
  attributes :id,
    :name,
    :desc,
    :permissions

  def permissions
    object.user.permissions.inject({}){|mem, c| mem[c.id] = PermissionSerializer.new(c); mem}
  end

end
