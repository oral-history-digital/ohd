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

  def in_place_edit_for(user_content, attribute, options={})
    value = user_content.send(attribute)
    value = '&nbsp;' * 8 if value.blank?
    id = "user_content_#{user_content.id}_#{attribute}"
    display_id = id + '_display'
    form_id = id + '_form'
    form_options = options.merge({
            :id => form_id,
            :url => user_content_path(user_content),
            :method => :put,
            :update => "user_content_#{user_content.id}",
            :html => options.merge({:class => 'inline'})
    })
    html = content_tag(:span, value, options.merge({:id => display_id, :class => "inline-editable", :style => 'display: inline;', :onclick => "$('#{display_id}').hide();$('#{id}').value = $('#{display_id}').innerHTML; $('#{form_id}').show(); Event.stop(event);"}))
    html << content_tag(:span, options.merge({:id => form_id, :style => 'display: none;'})) do
      form_remote_tag(form_options) do
        text_field_tag(user_content, attribute.to_sym, :id => id, :name => "user_content[#{attribute}]", :onclick => "Event.stop(event);")
      end
    end
    html
  end

  # render the interview references for a search item
  def reference_details_for_search(search)
    html = content_tag(:span, "#{search.properties['hits'] || t(:none)} #{t(:search_results, :scope => 'user_interface.labels')}")
    interview_stills = Interview.find(:all, :select => 'archive_id, still_image_file_name', :conditions => "archive_id IN ('#{search.interview_references.join("','")}')")
    image_list = search.interview_references.inject('') do |list, archive_id|
      if archive_id =~ /^za\d{3}$/
        image = interview_stills.select{|still| still.archive_id == archive_id }.first
        image_file = if image.nil? || image.still_image_file_name.nil?
          image_path("/archive_images/missing_still.jpg")
        else
          image_path(File.join("/interviews/stills", image.still_image_file_name.sub(/\.\w{3,4}$/,'_still_thumb\0')))
        end
        list << content_tag(:li, image_tag(image_file, :alt => archive_id))
      end
      list
    end
    html << content_tag(:ul, image_list)
    html << content_tag(:span, link_to('alle_anzeigen', '#'))
    html
  end

  # render a singular interview reference detail for interview or segment items
  def reference_details_for_interview(references)

  end

end