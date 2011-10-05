module UserContentsHelper

  def current_user
    @current_user
  end

  def query_hash_to_string(query)
    case query
      when Hash
        category_ids = query.values.flatten.inject([]){|ids, value| ids << value if (value.to_i != 0); ids }.uniq
        preloaded_categories = Category.find(:all, :conditions => "id IN (#{category_ids.join(',')})")
        fulltext = query.delete('fulltext')
        str = fulltext.nil? ? [] : [ t('fulltext').to_s + ': "' + fulltext.to_s + '"' ]
        str += query.keys.inject([]) do |out, key|
          values = query[key]
          case values
            when Array
              category_values = []
              values.map do |v|
                cat = preloaded_categories.select{|c| c.id == v.to_i}.first
                unless cat.nil?
                  category_values << t(cat.name, :scope => "categories.#{key}")
                end
              end
              out << t(key).to_s + ': ' + category_values.join(', ')
            else
              out << t(key).to_s + ': ' + values.to_s
          end
          out
        end
        str.join('; ')
      else
        query.to_s
    end
  end

end