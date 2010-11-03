# this is a custom authorization mixin for the
# *rails-authorization-plugin* and as such depends
# on that plugin being installed.

require File.join(File.dirname(__FILE__), '/publishare/exceptions')
require File.join(File.dirname(__FILE__), '/publishare/identity')

module Authorization
  module TaskAndGroupRoles
    
    # this is a custom Authorization Mixin for the
    # Rails-Authorization plugin. It provides an
    # authorization mechanism similar to Object Roles.
    #
    # Roles are assigned:
    # 1) through user groups on Model-Class level.
    # 2) through user tasks on Model instances similar
    #    to the concept of object roles / authorizables.
    #
    # Task-based roles share the lifetime of the Task -
    # when the job is finished, the role on the object
    # ceases to be active.

    module UserExtensions
      def self.included( recipient )
        recipient.extend( ClassMethods )
      end

      module ClassMethods
        def acts_as_authorized_user(roles_relationship_opts = {})
          include Authorization::TaskAndGroupRoles::UserExtensions::InstanceMethods
          include Authorization::Identity::UserExtensions::InstanceMethods   # Provides all kinds of dynamic sugar via method_missing
        end
      end

      module InstanceMethods
        # If roles aren't explicitly defined in user class then check roles table
        def has_role?( role_name, authorizable_obj = nil )
          role_name = stringify(role_name)
          
          # a User has all roles on himself
          return true if authorizable_obj == self
          
          if authorizable_obj.nil?
            !self.roles.select{|r| r.name == role_name }.empty?
          else
            role = get_role( role_name, authorizable_obj )
            role ? self.roles.include?( role) : false
          end
        end

        def has_role( role_name, authorizable_obj = nil )
          role_name = stringify(role_name)
          role = get_role( role_name, authorizable_obj )
          if role.nil?
            if authorizable_obj.is_a? Class
              role = Role.create( :name => role_name, :authorizable_type => authorizable_obj.to_s )
            elsif authorizable_obj.is_a?(String) || authorizable_obj.is_a?(Symbol)
              authorizable_obj = stringify(authorizable_obj, true)
              role = Role.create( :name => role_name, :authorizable_type => authorizable_obj )
            elsif authorizable_obj
              role = Role.create( :name => role_name, :authorizable => authorizable_obj )
            else
              role = Role.create( :name => role_name )
            end
          end
          if role and not self.roles.include?(role)
            self.user_roles.create :role => role
            # roles get updated on reload...
            # *Warning* a reload here is ugly
            save
            reload
          end
        end

        def has_no_role( role_name, authorizable_obj = nil  )
          role = get_role( role_name, authorizable_obj )
          delete_role_if_empty( role )
        end

        def has_roles_for?( authorizable_obj )
          if authorizable_obj.is_a? Class
            !self.roles.detect { |role| role.authorizable_type == authorizable_obj.to_s }.nil?
          elsif authorizable_obj.is_a?(String) || authorizable_obj.is_a?(Symbol)
            authorizable_obj = stringify(authorizable_obj, true)
            !self.roles.detect { |role| role.authorizable_type == authorizable_obj }.nil?
          elsif authorizable_obj
            !self.roles.detect { |role| role.authorizable_type == authorizable_obj.class.base_class.to_s && role.authorizable == authorizable_obj }.nil?
          else
            !self.roles.detect { |role| role.authorizable.nil? }.nil?
          end
        end
        alias :has_role_for? :has_roles_for?

        def roles_for( authorizable_obj )
          if authorizable_obj.is_a? Class
            self.roles.select { |role| role.authorizable_type == authorizable_obj.to_s }
          elsif authorizable_obj.is_a?(String) || authorizable_obj.is_a?(Symbol)
            authorizable_obj = stringify(authorizable_obj, true)
            self.roles.select { |role| role.authorizable_type == authorizable_obj }
          elsif authorizable_obj
            self.roles.select { |role| role.authorizable_type == authorizable_obj.class.base_class.to_s && role.authorizable.id == authorizable_obj.id }
          else
            self.roles.select { |role| role.authorizable.nil? }
          end
        end

        def has_no_roles_for(authorizable_obj = nil)
          old_roles = roles_for(authorizable_obj).dup
          roles_for(authorizable_obj).destroy_all
          old_roles.each { |role| delete_role_if_empty( role ) }
        end

        def has_no_roles
          old_roles = self.roles.dup
          self.roles.destroy_all
          old_roles.each { |role| delete_role_if_empty( role ) }
        end

        def authorizables_for( authorizable_class )
          unless authorizable_class.is_a? Class
            begin
              authorizable_class = stringify(authorizable_class, true).constantize
            rescue
              raise CannotGetAuthorizables, "Invalid argument: '#{authorizable_class}'. You must provide a class here."
            end
          end
          begin
            authorizable_class.find(
              self.roles.find_all_by_authorizable_type(authorizable_class.base_class.to_s).map(&:authorizable_id).uniq
            )
          rescue ActiveRecord::RecordNotFound
            []
          end
        end

        private

        def get_role( role_name, authorizable_obj )
          role = nil
          if authorizable_obj.is_a? Class
            role = Role.find( :first,
                       :conditions => [ 'name = ? and authorizable_type = ? and authorizable_id IS NULL', role_name, authorizable_obj.to_s ] )
          elsif authorizable_obj.is_a?(String) || authorizable_obj.is_a?(Symbol)
            authorizable_obj = stringify(authorizable_obj, true)
            role = Role.find( :first,
                       :conditions => [ 'name = ? and authorizable_type = ? and authorizable_id IS NULL', role_name, authorizable_obj ] )
          elsif authorizable_obj
            role = Role.find( :first,
                       :conditions => [ 'name = ? and authorizable_type = ? and authorizable_id = ?',
                                        role_name, authorizable_obj.class.base_class.to_s, authorizable_obj.id ] )
          else
            role = Role.find( :first,
                       :conditions => [ 'name = ? and authorizable_type IS NULL and authorizable_id IS NULL', role_name ] )
          end
          role
        end

        def delete_role_if_empty( role )
          return unless role.is_a?(Role)
          self.user_roles.each do |user_role|
            user_role.destroy if user_role.role_id == role.id
            self.roles.delete(role)
            # we are not destroying the actual Role object,
            # just the associated join record
          end
        end
        
        def stringify(input, camelize_me=false)
          if camelize_me
            input = input.to_s.camelize
          else
            input.to_s
          end
        end

      end
    end

    module ModelExtensions
      def self.included( recipient )
        recipient.extend( ClassMethods )
      end

      module ClassMethods
        def acts_as_authorizable
          has_many :accepted_roles, :as => :authorizable, :class_name => 'Role'

          has_many :users, :finder_sql => 'SELECT DISTINCT users.* FROM users INNER JOIN user_roles ON user_id = users.id INNER JOIN roles ON roles.id = role_id WHERE authorizable_type = \'#{self.class.base_class.to_s}\' AND authorizable_id = #{id}', :counter_sql => 'SELECT COUNT(DISTINCT users.id) FROM users INNER JOIN user_roles ON user_id = users.id INNER JOIN roles ON roles.id = role_id WHERE authorizable_type = \'#{self.class.base_class.to_s}\' AND authorizable_id = #{id}', :readonly => true

          before_destroy :remove_user_roles

          def accepts_role?( role_name, user )
            user.has_role? role_name, self
          end

          def accepts_role( role_name, user )
            user.has_role role_name, self
          end

          def accepts_no_role( role_name, user )
            user.has_no_role role_name, self
          end

          def accepts_roles_by?( user )
            user.has_roles_for? self
          end
          alias :accepts_role_by? :accepts_roles_by?

          def accepted_roles_by( user )
            user.roles_for self
          end

          def authorizables_by( user )
            user.authorizables_for self
          end

          include Authorization::TaskAndGroupRoles::ModelExtensions::InstanceMethods
          include Authorization::Identity::ModelExtensions::InstanceMethods   # Provides all kinds of dynamic sugar via method_missing
        end
      end

      module InstanceMethods
        # If roles aren't overriden in model then check roles table
        def accepts_role?( role_name, user )
          user.has_role? role_name, self
        end

        def accepts_role( role_name, user )
          user.has_role role_name, self
        end

        def accepts_no_role( role_name, user )
          user.has_no_role role_name, self
        end

        def accepts_roles_by?( user )
          user.has_roles_for? self
        end
        alias :accepts_role_by? :accepts_roles_by?

        def accepted_roles_by( user )
          user.roles_for self
        end

        private

        def remove_user_roles
          self.accepted_roles.each do |role|
            role.user_roles.delete_all
            role.destroy
          end
        end

      end
    end

  end
end
