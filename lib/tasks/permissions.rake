namespace :permissions do

    desc 'create permissions for all controllers and actions (if they do NOT exist)' 
    task :create => :environment do
      Rails.application.eager_load!
      ApplicationController.descendants.each do |controller|
        controller.instance_methods(false).each do |action|
          controller_name_prepared = controller.name.underscore.sub('_controller', '').singularize
          permission = Permission.find_or_create_by(controller: controller_name_prepared, action: action)
          permission.update_attribute(:name, "#{controller_name_prepared} #{action}") unless permission.name 
        end
      end
    end

end
