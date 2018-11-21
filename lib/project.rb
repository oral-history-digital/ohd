module Project

  class << self

    def project_config
      @project_config ||= Rails.configuration.project
    end

    def method_missing(n)
      if project_config.has_key? n.to_s 
        project_config[n.to_s] 
      else 
        #raise "#{self} does NOT have a key named #{n}"
        nil
      end
    end

    def name
      project_id
    end

    
    def keys
      project_config.keys
    end
    
    def person_properties
      project_config['person_properties']
    end
    
    def search_facets
      person_properties.select{|c| c['use_as_facet'] }
    end
    
    %w(registry_entry registry_reference_type person interview).each do |m|
      define_method "#{m}_search_facets" do
        person_properties.select{|c| c['use_as_facet'] && c['source'] == m }
      end
    end

    # could be used in the future for metadata that is not used as facet
    %w(registry_entry registry_reference_type person interview).each do |m|
      define_method "person_properties_with_source_#{m}" do
        person_properties.select{|c| c['use_as_facet'] && c['source'] == m }
      end
    end
    
    def search_facets_names
      person_properties.select{|c| c['use_as_facet'] }.map{|c| c['id']}
    end
    
    def min_to_max_birth_year_range
      Rails.cache.fetch("#{Project.project_id}-min_to_max_birth_year") do
        first = (Interview.all.map{|i| i.interviewees.first.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.first || 1900
        last = (Interview.all.map{|i| i.interviewees.first.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.last || DateTime.now.year
        (first..last)
      end
    end
    
    def search_facets_hash
      @search_facets_hash ||= search_facets.inject({}) do |mem, facet|
        case facet['source']
        when 'registry_entry'
          mem[facet['id'].to_sym] = ::FacetSerializer.new(RegistryEntry.find_by_entry_code(facet['id'])).as_json
        when 'registry_reference_type'
          mem[facet['id'].to_sym] = ::FacetSerializer.new(RegistryReferenceType.find_by_code(facet['id'])).as_json
        when 'person'
          if facet['id'] == 'year_of_birth'
            mem[facet['id'].to_sym] = {
              name: localized_hash_for("search_facets", facet['id']),
              subfacets: min_to_max_birth_year_range.inject({}) do |subfacets, key|
                h = {}
                I18n.available_locales.map{|l| h[l] = key}
                subfacets[key] = {
                  name: h,
                  count: 0
                }
                subfacets
              end
            }
          else
            mem[facet['id'].to_sym] = {
              name: localized_hash_for("search_facets", facet['id']),
              subfacets: facet['values'].inject({}) do |subfacets, (key, value)|
                subfacets[value] = {
                  name: localized_hash_for("search_facets", key),
                  count: 0
                }
                subfacets
              end
            }
          end
        when 'interview'
          mem[facet['id'].to_sym] = {
            name: localized_hash_for("search_facets", facet['id']),
            subfacets: Interview.all.inject({}) do |subfacets, interview|
              subfacets[interview.send(facet['id'])] = {
                name: interview.send("localized_hash_for_" + facet['id']),
                count: 0
              }
              subfacets
            end
          }
        when 'collection'
          mem[facet['id'].to_sym] = {
            name: localized_hash_for("search_facets", facet['id']),
            subfacets: Interview.all.inject({}) do |subfacets, interview|
              subfacets[interview.send(facet['id'])] = {
                name: interview.collection ? interview.collection.localized_hash : {en: 'no collection'},
                count: 0
              }
              subfacets
            end
          }
        when 'language'
          mem[facet['id'].to_sym] = {
            name: localized_hash_for("search_facets", facet['id']),
            subfacets: Interview.all.inject({}) do |subfacets, interview|
              subfacets[interview.send(facet['id'])] = {
                name: interview.language ? interview.language.localized_hash : {en: 'no language'},
                count: 0
              }
              subfacets
            end
          }
          # media_type is not valid as source anymore. is now covered by 'interview'
        # when 'media_type'
        #   mem[facet['id'].to_sym] = {
        #     name: localized_hash_for("search_facets", facet['id']),
        #     subfacets: Interview.all.inject({}) do |subfacets, interview|
        #       subfacets[interview.send(facet['id'])] = {
        #         name: interview.localized_hash_for_media_type,
        #         count: 0
        #       }
        #       subfacets
        #     end
        #   }
        end
        mem.with_indifferent_access
      end
    end

    def localized_hash_for(specifier, key=nil)
      I18n.available_locales.inject({}) do |desc, locale|
        desc[locale] = I18n.t([specifier, key].compact.join('.'), locale: locale)
        desc
      end
    end

    def updated_search_facets(search)
      facets = search_facets_hash.deep_dup
      search_facets_names.each do |facet|
        search.facet(facet).rows.each do |row|
          facets[facet][:subfacets][row.value][:count] = row.count if facets[facet][:subfacets][row.value]
        end
      end
      facets
    end

    #def archive_facet_category_ids
      #person_properties.select{|c| c['use_as_facet'] }.map{|c| c['id'].to_sym}
    #end 

    #def archive_category_ids
      #person_properties.map{|c| c['id'].to_sym }
    #end 

    #def is_category?(category_id)
      #category_id = category_id.to_sym
      #archive_category_ids.include? category_id
    #end 

    #def category_config(category_id)
      #category_id = category_id.to_s
      #person_properties.detect{|c| c['id'] == category_id}
    #end 

    #def category_object(category_id)
      #category_config = category_config(category_id)
      #category_object = case category_config['source']
                        #when 'registry_entry'
                          #RegistryEntry.find_by_entry_code(category_config['name'])
                          ##RegistryEntry.find_by_name(category_config['name'])
                        #when 'registry_reference_type'
                          #RegistryReferenceType.find_by_code(category_id.to_s.singularize)
                        #else
                          #raise 'Category configuration error.'
                        #end
      #raise 'Category object not found' if category_object.blank?
      #category_object
    #end

    #def category_name(category_id, locale = I18n.locale)
      #category_object = begin category_object(category_id) rescue nil end
      #category_object.blank? ? '[Category Configuration Error]' : category_object.localized_hash
      ## TODO: update to be conform with other projects
      ##category_object.blank? ? '[Category Configuration Error]' : category_object.to_s(locale)
    #end

  end

  #module CategoryExtension
    #def self.included(base)
      #Project.archive_category_ids.each do |category_id|
        #base.class_eval <<-CAT
          #def #{category_id}
            #RegistryEntry.find_all_by_category('#{category_id}', self)
          #end

          #def #{category_id.to_s.singularize}_ids
            #self.#{category_id}.map(&:id)
          #end

          #def #{category_id.to_s.singularize}_names(locale = I18n.default_locale)
            #if self.#{category_id}.empty?
              #nil
            #else
              #self.#{category_id}.map{|c| c.to_s(locale).sub(/, ---$/, '')}.join(I18n.locale == :ru ? ' / ' : '; ')
            #end
          #end
        #CAT
      #end
    #end
  #end

end

