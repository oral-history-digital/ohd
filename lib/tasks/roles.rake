namespace :roles do

  desc 'create permissions for all models (if they do NOT exist)' 
  task :create_permissions => :environment do
    Rails.application.eager_load!
    ApplicationRecord.descendants.each do |model|
      %w(create update destroy).each do |action_name|
        klass = model.name
        permission = Permission.find_or_create_by(klass: klass, action_name: action_name)
        permission.update_attribute(:name, "#{klass} #{action_name}") unless permission.name 
      end
    end
  end

  desc 'create default roles and permissions' 
  task :create_default_roles_and_permissions => :environment do
    Project.all.each do |project|
      YAML.load_file(File.join(Rails.root, 'config/defaults/roles.yml')).each do |role_permission|
        role = Role.find_or_create_by(name: role_permission[:name], project_id: project.id)
        role_permission[:permissions].each do |permission|
          perm = Permission.find_or_create_by(klass: permission[:klass], action_name: permission[:action_name])
          perm.update_attribute(:name, "#{permission[:klass]} #{permission[:action_name]}")
          RolePermission.find_or_create_by(role_id: role.id, permission_id: perm.id)
        end
      end
    end
  end

end
