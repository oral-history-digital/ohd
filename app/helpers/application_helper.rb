# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def external_url(page_token)
    begin
      url_for Project.external_links[page_token.to_s][I18n.locale.to_s]
    rescue
      ''
    end
  end

  def external_link(name, page_token)
    link_to t(name), external_url(page_token), :title => t(:notice, :scope => 'external_links'), :target => '_blank'
  end

  def current_search_path
    if !@search.is_a?(Search) || @search.query_hash.blank?
      new_search_url
    else
      url_for({:controller => :searches, :action => :query, :suche => @search.query_hash })
    end
  end

  def reset_search_link(options={})
    #options are ignored
    link_to content_tag('span', t(:reset, :scope => 'user_interface.search')) + '&nbsp;'.html_safe + image_tag(image_path "#{Rails.configuration.x.project}/suche_reset1.gif"),
                   new_search_path(:referring_controller => controller_name, :referring_action => action_name),
            :method => :get

  end

  # Formats attributes for display
  def format_value(value)
    # when matching with Array class doesn't work
    return value.map{|v| v.to_s }.join(', ') if value.is_a?(Array)
    case value
    when Timecode
      value.minimal
    when Hash
      return value.values.map{|v| v.to_s}.join(', ')
    when Numeric
      return value.to_s.rjust(3, ' ')
    else
      value.to_s
    end
  end

  #
  def link_to_segment(segment, match_text='', show_segment_text=false, ajax=false, options={})
    interview = segment.interview
    item = segment.tape.number
    position = segment.start_time.round
    transcript_language = options.delete(:transcript_language)
    link_text = options.delete(:link_text)
    link_text ||= show_segment_text ? "#{content_tag(:span, "#{segment.timecode}", :class => :timecode)}#{truncate(segment_excerpt_for_match(segment, match_text, 10, transcript_language), :length => 300)}" : t(:segment_link, :scope => "user_interface.labels")
    if @object.is_a?(Interview) || ajax
      link_to link_text.html_safe, '#', class: 'seek_position', data: {item: item-1, position: position }
    else
      link_to link_text.html_safe, interview_path(interview, :item => item, :position => position), options
    end
  end

  def segment_excerpt_for_match(segment, original_query='', width=10, transcript_language=nil)
    # Implement fallback rule for segments if no explicit language has been given:
    # - Show the German translation of segments when German is the current UI locale.
    # - Otherwise show the original language of the transcript.
    # (see https://docs.google.com/document/d/1pTk4EQHVjbNjYdLXTEhV340wGt4DcHUY7PZYW6gxyGg/edit#heading=h.gtrastts25e5)
    transcript_language ||= (I18n.locale == :de ? :translated : :original)
    transcript = if transcript_language == :translated and not segment.translation.empty?
                   segment.translation
                 else
                   segment.transcript
                 end
    transcript.gsub!(/[*~]([^*~]*)[*~]/,'\1')

    query_string = Regexp.escape(original_query).gsub('\*','\w*')
    unless query_string.index(' ').nil?
      # Check if the expression matches directly.
      pattern = Regexp.new query_string, Regexp::IGNORECASE
      if transcript[pattern].blank?
        # If not: change the query string to match multiple expressions.
        query_string.gsub!(/([^'"]+)\s+([^'"]+)/,'\1_\2')
        query_string.gsub!(/(\S+)\s+(\S+)/,'\1|\2')
        query_string.gsub!(/(['"])+([^'"]*)\1/,'(\2)')
      end
    end
    query_string.gsub!('_',' ')
    pattern = Regexp.new(('(\w+\W+)?' * width) + (query_string.blank? ? '' : ('(\w*' + query_string + '\w*)\W+')) + '(\w+\W+){0,' + width.to_s + '}', Regexp::IGNORECASE)
    match_text = transcript[pattern]
    if match_text.nil?
      truncate(transcript, :length => 180)
    else
      str = transcript.index(match_text) == 0 ? '' : '&hellip;'
      match_text.gsub!(Regexp.new('(\W|^)(\w*' + query_string + '\w*)', Regexp::IGNORECASE),"\\1<span class='highlight'>\\2</span>")
      "#{str}#{match_text}#{(match_text.last == '.' ? '' : '&hellip;')}".html_safe
    end
  end

  def cedar_paginate(collection, params=nil)
    params.delete_if{|k,v| v.blank? }
    will_paginate collection,
                  { :previous_label => I18n.t(:previous),
                    :next_label => I18n.t(:next),
                    :params => params
                  }
  end

  def last_import
    # $last_import_date ||= begin
    #   last_import = Import.last.first
    #   last_import ||= Interview.first(:order => "created_at DESC")
    #   case last_import
    #     when Import
    #       last_import.time
    #     when Interview
    #       last_import.created_at
    #     else
          Time.gm(2010,9,22)
    #   end
    # end
  end

  # returns an area_id string per
  def current_area_id
    case controller_name
      when /searches/
        'search-page'
      when /interviews/
        'interview-page'
      when /collections/
        'collection-page'
      else
        'archive-page'
    end
  end

  def javascript_instant_modal_window(dom_id, cookie=nil)
    cookie_condition = cookie.nil? ? 'var openDialog = true; var cookieDialog = ""' : <<JS_COND
var cookiestr = readCookie('#{cookie}');
var openDialog = (cookiestr) ? false : true;
var cookieDialog = "<div class='checkbox_notification'><label class='checkbox'><input type='checkbox' class='checkbox' value='true' onChange=\\"toggleCookieStore('#{cookie}');\\"></input>#{I18n.t('user_interface.messages.dont_show_again')}</label></div>";
JS_COND
    <<JS
#{cookie_condition}
if(openDialog) {
  var closeButton = "<a id='modal_window_close' onclick=\\"new Effect.Fade('shades', { from: 0.6, duration: 0.4 }); $('modal_window').hide(); return false;\\" href='#'>X</a>";
  $('modal_window').innerHTML = closeButton + $('#{dom_id}').innerHTML + cookieDialog;
  new Effect.Parallel([new Effect.Appear('shades'), new Effect.Appear('modal_window')], { to: 0.6, duration: 0.4 });
}
JS
  end

  # This method renders a close button on the lightbox if the current
  # request was engaged by XHTTP.
  def modal_window_close_button_on_javascript_request
    if request.xhr?
      link_to('X', '#', id: 'modal_window_close')
    end
  end

  # provides a date stamp for the registry reference data to circumvent rigid caching
  def map_data_datestamp
    date = Import.first :select => "time", :conditions => "time < '#{DateTime.now.beginning_of_week.to_s(:db)}'", :order => "time DESC"
    date = date.nil? ? DateTime.now.beginning_of_week : date.time
    date.strftime('%Y%m%d')
  end

  # presents an adequatly formatted string as a Time representation and handles nil time
  def formatted_time(time, nilstring='&mdash;', formatstring='%d.%m.%Y %H:%M', de_suffix=' Uhr')
    case time
      when Time
        time.strftime(formatstring) + (I18n.locale == :de ? de_suffix : '')
      when String
        # converts the base DB storage format of time string representations
        time.sub(/(\d{4})\D+(\d{2})\D+(\d{2})\D+(\d{2})\D+(\d{2}).*/,'\3.\2.\1 \4:\5')
      else
        nilstring
    end
  end

  # presents adequatly formatted string in date format as a Time representation and handles nil
  def formatted_date(time, nilstring='&mdash;')
    case time
      when String
        # converts the base DB storage format of time string representations
        time.sub(/(\d{4})\D+(\d{2})\D+(\d{2})\D+.*/,'\3.\2.\1')
      else
        formatted_time(time, nilstring, '%d.%m.%Y', '')
    end
  end

  def timecode_without_tape(string)
    string.sub(/\[\d+\]\s+/,'')
  end

  # provides buttons for workflow state changes
  def workflow_action_for(model, action, instance, cancel=false)
    model_name = model.to_s.underscore.pluralize
    link_to t(action.to_s, :scope => "#{model_name}.workflow_actions"), '#', 
            class: "button remote #{cancel ? 'cancel' : 'submit'}",
            url: eval("#{action}_admin_#{model_name.singularize}_path(id: #{instance.id})"),
            title: t(action.to_s, :scope => "#{model_name}.workflow_action_tooltips")
  end

end
