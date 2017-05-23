module Project

  class << self

    def method_missing(n)
      if Rails.configuration.project.has_key? n.to_s 
        Rails.configuration.project[n.to_s] 
      else 
        #raise "#{self} does NOT have a key named #{n}"
        nil
      end
    end

    def name
      project_id
    end

    def keys
      Rails.configuration.project.keys
    end

    def person_properties
      Rails.configuration.project['person_properties']
    end

    def archive_facet_category_ids
      person_properties.select{|c| c['use_as_facet'] }.map{|c| c['id'].to_sym}
    end 

    def archive_category_ids
      person_properties.map{|c| c['id'].to_sym }
    end 

    def is_category?(category_id)
      category_id = category_id.to_sym
      archive_category_ids.include? category_id
    end 

    def category_config(category_id)
      category_id = category_id.to_s
      person_properties.detect{|c| c['id'] == category_id}
    end 

    def category_object(category_id)
      category_config = category_config(category_id)
      category_object = case category_config['source']
                        when 'registry_entry'
                          RegistryEntry.find_by_name(category_config['descriptor'])
                        when 'registry_reference_type'
                          RegistryReferenceType.find_by_code(category_id.to_s.singularize)
                        else
                          raise 'Category configuration error.'
                        end
      raise 'Category object not found' if category_object.blank?
      category_object
    end

    def category_name(category_id, locale = I18n.locale)
      category_object = begin category_object(category_id) rescue nil end
      category_object.blank? ? '[Category Configuration Error]' : category_object.to_s(locale)
    end


  end

  module CategoryExtension
    def self.included(base)
      Project.archive_category_ids.each do |category_id|
        base.class_eval <<-CAT
          def #{category_id}
            RegistryEntry.find_all_by_category('#{category_id}', self)
          end

          def #{category_id.to_s.singularize}_ids
            self.#{category_id}.map(&:id)
          end

          def #{category_id.to_s.singularize}_names(locale = I18n.default_locale)
            if self.#{category_id}.empty?
              nil
            else
              self.#{category_id}.map{|c| c.to_s(locale).sub(/, ---$/, '')}.join(I18n.locale == :ru ? ' / ' : '; ')
            end
          end
        CAT
      end
    end
  end

end

