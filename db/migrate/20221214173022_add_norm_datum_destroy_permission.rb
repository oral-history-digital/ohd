class AddNormDatumDestroyPermission < ActiveRecord::Migration[5.2]
  def up
    permission = Permission.find_or_create_by(
      klass: 'NormDatum',
      action_name: 'destroy',
      name: 'NormDatum destroy'
    )
    Project.all.each do |project|
      %w(Sammlungsmanagement Qualitätsmanagement Erschließung).each do |role_name|
        role = Role.where(name: role_name, project_id: project.id).first
        RolePermission.find_or_create_by(role_id: role.id, permission_id: permission.id) if role
      end
    end
  end

  def down
    Permission.find_by_name('NormDatum destroy').destroy
  end

end
