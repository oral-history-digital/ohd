module ZWAR

  module CategoryExtension

    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods

      def is_categorized_by(category_type, name, options={})

        self.class_eval <<CAT

          has_many  :#{category_type}_categorizations,
                    :class_name => 'Categorization',
                    :conditions => "categorizations.category_type = '#{name}'"

          # TODO: an add method that creates an entry on the JOIN table
          has_many  :#{category_type},
                    :class_name => 'Category',
                    :through => :#{category_type}_categorizations,
                    :source => :category,
                    :conditions => "categories.category_type = '#{name}'"
CAT

      end

    end

  end


end

ActiveRecord::Base.send :include, ZWAR::CategoryExtension
