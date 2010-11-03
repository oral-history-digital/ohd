require File.join(File.dirname(__FILE__), '/authorization/authorization')

ActionController::Base.send( :include, Authorization::Base )
ActionView::Base.send( :include, Authorization::Base::ControllerInstanceMethods )

# You can perform authorization at varying degrees of complexity.
# Choose a style of authorization below (see README.txt) and the appropriate
# mixin will be used for your app.

# When used with the auth_test app, we define this in config/environment.rb
# AUTHORIZATION_MIXIN = "hardwired"
if not Object.constants.include? "AUTHORIZATION_MIXIN"
  AUTHORIZATION_MIXIN = "items and groups"
end

case AUTHORIZATION_MIXIN.to_s.underscore.gsub('_',' ')
  when "hardwired"
    require File.join(File.dirname(__FILE__),'/authorization/publishare/hardwired_roles')
    ActiveRecord::Base.send( :include,
      Authorization::HardwiredRoles::UserExtensions,
      Authorization::HardwiredRoles::ModelExtensions
    )
  when "object roles"
    require File.join(File.dirname(__FILE__),'/authorization/publishare/object_roles_table')
    ActiveRecord::Base.send( :include,
      Authorization::ObjectRolesTable::UserExtensions,
      Authorization::ObjectRolesTable::ModelExtensions
    )
  when 'items and groups'
    require File.join(File.dirname(__FILE__),'/authorization/item_and_group_roles')
    ActiveRecord::Base.send( :include,
      Authorization::ItemAndGroupRoles::UserExtensions,
      Authorization::ItemAndGroupRoles::ModelExtensions
    )
  when 'tasks and groups'
    require File.join(File.dirname(__FILE__),'/authorization/task_and_group_roles')
    ActiveRecord::Base.send( :include,
      Authorization::TaskAndGroupRoles::UserExtensions,
      Authorization::TaskAndGroupRoles::ModelExtensions
    )
end