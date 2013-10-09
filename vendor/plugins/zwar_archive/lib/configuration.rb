module ZWAR

  module Configuration

    module ActiveRecord

      def self.included(base)
        base.extend ActiveRecordClassMethods
      end

      module ActiveRecordClassMethods

        def path_to_storage=(path)
          @@path_to_storage=path
        end

        def path_to_storage
          @@path_to_storage || './public'
        end

        def path_to_photo_storage=(path)
          @@path_to_photo_storage=path
        end

        def path_to_photo_storage
          @@path_to_photo_storage || './public/images'
        end

      end

    end

  end

end

ActiveRecord.send :include, ZWAR::Configuration::ActiveRecord
