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
    # Render fulltext search.
    fulltext = query.delete('fulltext')
    str = fulltext.nil? ? [] : [ "#{t('facets.fulltext')}: \"#{fulltext}\"" ]

    # Preload interview by ID.
    interview_ids = (query['interview_id'] || []).map(&:to_i).select{|id| id != 0}.compact.uniq
    preloaded_interviews = interview_ids.empty? ? [] : Interview.all(:conditions => [ 'id IN (?)', interview_ids ])

    # Preload language by ID.
    language_ids = (query['language_id'] || []).map(&:to_i).select{|id| id != 0}.compact.uniq
    preloaded_languages = language_ids.empty? ? [] : Language.all(:conditions => [ 'id IN (?)', language_ids ], :include => :translations)

    # Preload queried categories by ID.
    category_names = CeDiS.archive_category_ids.map(&:to_s)
    category_ids = query.select{|key,value| category_names.include? key}.map(&:second).flatten.map(&:to_i).select{|id| id != 0}.compact.uniq
    preloaded_categories = category_ids.empty? ? [] : RegistryEntry.all(:conditions => [ 'id IN (?)', category_ids ], :include => {:registry_names => :translations})

    # Render keywords, categories and interviews.
    str += query.keys.inject([]) do |out, key|
      human_readable_facet_name = CeDiS.is_category?(key) ? CeDiS.category_name(key) : t(key, :scope => :facets)
      values = query[key]
      case values
        when Array
          # Category search...
          # Retrieve translated category names for category IDs.
          facet_values = []
          values.map do |v|
            if key == 'interview_id'
              int = preloaded_interviews.detect{|i| i.id = v.to_i}
              unless int.nil?
                facet_values << int.full_title(I18n.locale)
              end
            else
              cat = (key == 'language_id' ? preloaded_languages : preloaded_categories).detect{|c| c.id == v.to_i}
              unless cat.nil?
                facet_values << cat.to_s(I18n.locale)
              end
            end
          end
          out << "#{human_readable_facet_name}: #{facet_values.join(', ')}"

        else
          # Keyword search...
          out << "#{human_readable_facet_name}: #{values}"

      end
      out
    end
    str.join('; ')
  end

  def in_place_edit_for(user_content, attribute, options={})
    value = user_content.send(attribute)
    id = "user_content_#{user_content.id}_#{attribute}"
    display_id = id + '_display'
    form_id = id + '_form'
    text_area = options.delete(:text_area)
    path_prefix = options.delete(:path_prefix)
    model_name = user_content.is_a?(UserContent) ? 'user_content' : user_content.class.name.underscore
    context = options.delete(:context) || model_name
    update_path = (context == 'user_content') ? user_content_path(user_content) : eval("#{[path_prefix, model_name].compact.join('_')}_path(user_content)")
    form_options = options.merge({
            :id => form_id,
            :url => update_path,
            :method => :put,
            :before => "toggleFormAction('#{id}'); $('#{id + '_interface_status'}').value = ($('user_content_#{user_content.id}').hasClassName('closed') ? 'closed' : ''); addExtraneousFormElements(this, '.edit, .item', '.editor');",
            :complete => 'togglingContent = 0;',
            :html => options.merge({:class => 'inline'})
    })
    js_reset = "$('#{form_id}').hide(); $('#{display_id}').show(); Event.stop(event);"
    html = content_tag(:span, value.blank? ? ('&nbsp;' * 8) : value, options.merge({:id => display_id, :class => 'inline-editable', :onclick => "if(!this.up('.closed')) { showInlineEditForm('#{id}', #{text_area ? 'true' : 'false'}); Event.stop(event); }"})) # Event.stop(event)
    html << content_tag((text_area ? :div : :span), options.merge({:id => form_id, :class => 'inline-editor', :style => 'display: none;'})) do
      form_remote_tag(form_options) do
        form_html = hidden_field_tag :interface_status, 'open', :id => id + '_interface_status'
        form_html += if text_area
          text_area_tag(user_content, user_content.send(attribute.to_sym), :id => id, :name => "#{model_name}[#{attribute}]", :class => 'editor', :onclick => 'Event.stop(event)') \
        else
          text_field_tag(user_content, user_content.send(attribute.to_sym), :id => id, :name => "#{model_name}[#{attribute}]", :class => 'editor', :onclick => 'Event.stop(event)')
        end
        form_html += hidden_field_tag :context, context
        buttons_html = submit_tag(submit_text = t(:update, :scope => 'user_interface.actions'), :id => "#{id}_update",:title => submit_text,:class => 'update', :onclick => 'togglingContent = 1;')
        buttons_html += "<input type='reset' id='#{id}_reset' name='#{user_content.id}_#{attribute}_reset' title='#{t(:reset, :scope => 'user_interface.actions')}' onclick=\"#{js_reset}\" class='reset'/>"
        spinner_html = image_tag(image_path('/images/spinner.gif'), :id => "#{id}_spinner", :style => 'display:none;')
        form_html + buttons_html + spinner_html
      end
    end
    html
  end

  # render the interview references for a search item
  def reference_details_for_search(search)
    html = content_tag(:span, t(:search_results_with_count, :scope => 'user_interface.labels', :count => search.properties['hits'] || t(:none)))
    interview_stills = Interview.all(
        :select => 'id, archive_id, still_image_file_name',
        :include => :translations,
        :conditions =>['archive_id IN (?)', search.interview_references]
    )
    image_list = search.interview_references.inject('') do |list, archive_id|
      if archive_id =~ Regexp.new("^#{CeDiS.config.project_initials.downcase}\\d{3}$")
        image = interview_stills.select{|still| still.archive_id == archive_id }.first
        image_file = if image.nil? || image.still_image_file_name.nil?
          image_path('/archive_images/missing_still.jpg')
        else
          image_path(File.join('/interviews/stills', image.still_image_file_name.sub(/\.\w{3,4}$/,'_still_thumb\0')))
        end
        list << content_tag(:li, image_tag(image_file, :alt => archive_id, :title => "#{image.full_title(I18n.locale)} (#{archive_id})"))
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
      image_path('/archive_images/missing_still.jpg')
    else
      image_path(File.join('/interviews/stills', interview.still_image_file_name.sub(/\.\w{3,4}$/,'_still_small\0')))
    end
    image_html = if interview.nil?
      image_tag(image_file)
    else
      image_tag(image_file, :alt => interview.archive_id, :title => "#{interview.full_title(I18n.locale)} (#{interview.archive_id})")
    end
    return image_html if interview.nil?
    html = link_to(image_html, interview_path(:id => interview.archive_id), :target => '_blank')
    html << content_tag(:span, link_to("»&nbsp;#{t(:show_interview, :scope => 'user_interface.labels')}", interview_path(:id => interview.archive_id), :target => '_blank'))
    biographic = ''
    # collection
    biographic << content_tag(:li, label_tag(:collection, Interview.human_attribute_name('collection')) \
                  + content_tag(:p, interview.collection))
    # TODO: Distinguish more generically between historical contexts when adding more projects.
    if interview.respond_to?(:forced_labor_groups)
      # forced labor groups
      biographic << content_tag(:li, label_tag(:forced_labor_groups, Interview.human_attribute_name(:forced_labor_groups)) \
                    + content_tag(:p, interview.forced_labor_groups.join(', ')))
    end
    if interview.respond_to?(:forced_labor_habitations)
      # habitations
      biographic << content_tag(:li, label_tag(:forced_labor_habitations, Interview.human_attribute_name(:forced_labor_habitations)) \
                    + content_tag(:p, interview.forced_labor_habitations.join(', ')))
    end
    content_tag(:div, html, :class => 'image-link') + content_tag(:ul, biographic)
  end

  # render a singular interview reference detail for segment with or without annotation
  def reference_details_for_segment(user_content)
    segment = user_content.reference
    interview = segment.interview
    image_file = if interview.nil? || interview.still_image_file_name.nil?
                   image_path('/archive_images/missing_still.jpg')
                 else
                   image_path(File.join('/interviews/stills', interview.still_image_file_name.sub(/\.\w{3,4}$/,'_still_small\0')))
                 end
    image_html = if interview.nil?
             image_tag(image_file)
           else
             image_tag(image_file, :alt => interview.archive_id, :title => "#{interview.full_title(I18n.locale)} (#{interview.archive_id})")
           end
    html = link_to_segment(segment, '', false, false, { :link_text => image_html, :target => '_blank'})
    html << content_tag(:span, segment.timecode, :class => 'time-overlay')
    html << content_tag(:span, link_to_segment(segment, '', false, false, { :link_text => "&raquo;&nbsp;#{t(:show_segment, :scope => 'user_interface.labels')}", :target => '_blank'}))
    annotation = content_tag(:li, label_tag(:heading, UserAnnotation.human_attribute_name(:heading)) \
                  + content_tag(:p, user_content.heading))
    transcript_field = user_content.translated? ? :translation : :transcript
    annotation << content_tag(:li, label_tag(Segment.human_attribute_name(transcript_field)) + content_tag(:p, segment.send(transcript_field).gsub(/\*([^*]+:)\*/, '<em>\1</em>')))
    content_tag(:div, html, :class => 'image-link') + content_tag(:ul, annotation)
  end

  def topics_select(name, options={}, selected=[])
    tag_values = options_for_select((current_user ? current_user.tags : []).map{|t| [t.name, t.name] }, selected)
    select_tag(name, tag_values, options.merge({'data-placeholder' => t(:please_select, :scope => 'user_interface.labels'), :multiple => true}))
  end

end
