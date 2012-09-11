module UserContentsHelper

  include TagsHelper # acts_as_taggable_on_steroids

  def current_user
    @current_user
  end

  def users_first_name
    @nick ||= current_user.blank? ? current_user_account.login : current_user.first_name
    @nick[/^[^\s]*/]
  end

  def query_hash_to_string(query)
    case query
      when Hash
        category_ids = query.values.flatten.inject([]){|ids, value| ids << value if (value.to_i != 0); ids }.uniq
        preloaded_categories = category_ids.empty? ? [] : Category.find(:all, :conditions => "id IN (#{category_ids.join(',')})")
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
    text_area = options.delete(:text_area)
    form_options = options.merge({
            :id => form_id,
            :url => user_content_path(user_content),
            :method => :put,
            :before => "toggleFormAction('#{id}'); $('#{id + '_interface_status'}').value = interfaceStatusValueOf('user_content_#{user_content.id}'); addExtraneousFormElements(this, '.item', '.editor');",
            :complete => "togglingContent = 0;",
            :html => options.merge({:class => 'inline'})
    })
    js_reset = "$('#{form_id}').hide(); $('#{display_id}').show(); Event.stop(event);"
    html = content_tag(:span, value, options.merge({:id => display_id, :class => "inline-editable", :onclick => "if(!this.up('.closed')) { showInlineEditForm('#{id}', #{text_area ? 'true' : 'false'}); Event.stop(event); }"})) # Event.stop(event)
    html << content_tag((text_area ? :div : :span), options.merge({:id => form_id, :style => 'display: none;'})) do
      form_remote_tag(form_options) do
        form_html = hidden_field_tag :interface_status, 'open', :id => id + '_interface_status'
        form_html += if(text_area)
          text_area_tag(user_content, user_content.send(attribute.to_sym), :id => id, :name => "user_content[#{attribute}]", :class => 'editor', :onclick => "Event.stop(event)") \
        else
          text_field_tag(user_content, user_content.send(attribute.to_sym), :id => id, :name => "user_content[#{attribute}]", :class => 'editor', :onclick => "Event.stop(event)")
        end
        buttons_html = submit_tag(submit_text = t(:update, :scope => 'user_interface.actions'), :id => "#{id}_update",:title => submit_text,:class => "update", :onclick => "togglingContent = 1;")
        buttons_html += "<input type='reset' id='#{id}_reset' name='#{user_content.id}_#{attribute}_reset' title='#{t(:reset, :scope => 'user_interface.actions')}' onclick=\"#{js_reset}\" class='reset'/>"
        spinner_html = image_tag(image_path('/images/spinner.gif'), :id => "#{id}_spinner", :style => 'display:none;')
        form_html + buttons_html + spinner_html
      end
    end
    html
  end

  # render the interview references for a search item
  def reference_details_for_search(search)
    html = content_tag(:span, "#{search.properties['hits'] || t(:none)} #{t(:search_results, :scope => 'user_interface.labels')}")
    interview_stills = Interview.find(:all, :select => 'archive_id, full_title, still_image_file_name', :conditions => "archive_id IN ('#{search.interview_references.join("','")}')")
    image_list = search.interview_references.inject('') do |list, archive_id|
      if archive_id =~ /^za\d{3}$/
        image = interview_stills.select{|still| still.archive_id == archive_id }.first
        image_file = if image.nil? || image.still_image_file_name.nil?
          image_path("/archive_images/missing_still.jpg")
        else
          image_path(File.join("/interviews/stills", image.still_image_file_name.sub(/\.\w{3,4}$/,'_still_thumb\0')))
        end
        list << content_tag(:li, image_tag(image_file, :alt => archive_id, :title => "#{image.full_title} (#{archive_id})"))
      end
      list
    end
    html << content_tag(:ul, image_list)
    html << content_tag(:span, link_to("»&nbsp;#{t(:show_all, :scope => 'user_interface.labels')}", search_by_hash_path(:suche => search.properties['query_hash']), :target => '_blank'))
    html
  end

  # render a singular interview reference detail for interview or segment items
  def reference_details_for_interview(interview)
    image_file = if interview.nil? || interview.still_image_file_name.nil?
      image_path("/archive_images/missing_still.jpg")
    else
      image_path(File.join("/interviews/stills", interview.still_image_file_name.sub(/\.\w{3,4}$/,'_still_small\0')))
    end
    html = if interview.nil?
      image_tag(image_file)
    else
      image_tag(image_file, :alt => interview.archive_id, :title => "#{interview.full_title} (#{interview.archive_id})")
    end
    return html if interview.nil?
    html << content_tag(:span, link_to("»&nbsp;#{t(:show_interview, :scope => 'user_interface.labels')}", interview_path(:id => interview.archive_id), :target => '_blank'))
    biographic = ''
    # collection
    biographic << content_tag(:li, label_tag(:collection, Interview.human_attribute_name('collection')) \
                  + content_tag(:p, t(interview.collection, :scope => 'collections.name')))
    # forced labor groups
    biographic << content_tag(:li, label_tag(:forced_labor_groups, Interview.human_attribute_name(:forced_labor_groups)) \
                  + content_tag(:p, interview.forced_labor_groups.map{|f| t(f, :scope => 'categories.forced_labor_groups')}.join(', ')))
    # habitations
    biographic << content_tag(:li, label_tag(:forced_labor_habitations, Interview.human_attribute_name(:forced_labor_habitations)) \
                  + content_tag(:p, interview.forced_labor_habitations.map{|l| t(l, :scope => 'categories.forced_labor_habitations')}.join(', ')))
    content_tag(:div, html, :class => "image-link") + content_tag(:ul, biographic)
  end

  def topics_select(name, options={}, selected=[])
    tag_values = options_for_select((current_user ? current_user.tags : []).map{|t| [t.name, t.id] }, selected)
    select_tag(name, tag_values, options.merge({'data-placeholder' => 'Bitte waehlen...', :multiple => true}))
  end

end