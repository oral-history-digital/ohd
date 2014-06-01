module ZWAR

  module CategoryExtension

    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods

      def is_categorized_by(category_type, name, options={})

        category_type = category_type.to_s

        self.class_eval <<CAT

          has_many  :#{category_type}_categorizations,
                    :class_name => 'Categorization',
                    :conditions => "categorizations.category_type = '#{name}'"

          has_many  :#{category_type},
                    :class_name => 'Category',
                    :through => :#{category_type}_categorizations,
                    :source => :category,
                    :conditions => "categories.category_type = '#{name}'"

          def #{category_type.singularize}_ids
            #{category_type}_categorizations.map(&:category_id)
          end
CAT

      end

    end

  end

end

ActiveRecord::Base.send :include, ZWAR::CategoryExtension
