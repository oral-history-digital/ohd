namespace :permissions do

    desc 'create permissions for all controllers and actions (if they do NOT exist)' 
    task :create => :environment do
      Rails.application.eager_load!
      ApplicationController.descendants.each do |controller|
        controller.instance_methods(false).each do |action_name|
          klass = controller.name.sub('Controller', '').singularize
          permission = Permission.find_or_create_by(klass: klass, action_name: action_name)
          permission.update_attribute(:name, "#{klass} #{action_name}") unless permission.name 
        end
      end
    end

end
