module Devise

  module ArchiveModelExtensions

    module UserExtension

      def self.included(recipient)
        recipient.extend(ClassMethods)
        recipient.class_eval do
          has_one :authenticatable
          has_one :user_account, :through => :authenticatable
        end
        super
      end


      module ClassMethods

        # Authenticate a user based on configured attribute keys. Returns the
        # authenticated user if it's valid or nil.
        def authenticate(attributes={})
          return unless Devise.authentication_keys.all? { |k| attributes[k].present? }
          conditions = attributes.slice(*Devise.authentication_keys)
          auth_proxy = find_for_authentication(conditions)
          auth_proxy.authenticatables.first if auth_proxy.try(:valid_for_authentication?, attributes)
        end

        private

        # Find first record based on conditions given (ie by the sign in form).
        # Overwrite to add customized conditions, create a join, or maybe use a
        # namedscope to filter records while authenticating.
        # Example:
        #
        #   def self.find_for_authentication(conditions={})
        #     conditions[:active] = true
        #     find(:first, :conditions => conditions)
        #   end
        #
        def find_for_authentication(conditions)
          UserAccount.find(:first, :conditions => conditions)
        end

      end

    end

  end

end