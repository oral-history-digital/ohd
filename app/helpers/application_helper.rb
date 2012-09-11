# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def external_url(page_token)
    begin
      url_for t(page_token.to_s, :scope => 'external_links')
    rescue
      ''
    end
  end

  def external_link(name, page_token)
    link_to t(name), external_url(page_token), :title => t(:notice, :scope => 'external_links'), :target => '_blank'
  end

  def current_locale
    code = params[:locale] || session[:locale]
    code.nil? ? :de : code.to_sym
  end

  def current_search_path
    if !@search.is_a?(Search) || @search.query_hash.blank?
      new_search_url
    else
      url_for({:controller => :searches, :action => :query, :suche => @search.query_hash })
    end
  end

  def reset_search_link(options={})
    link_to_remote content_tag('span', t(:reset, :scope => 'user_interface.search')) + image_tag(image_path 'suche_reset1.gif'),
                   options.merge!({ :url => new_search_path(:referring_controller => controller_name, :referring_action => action_name), :method => :get })
  end

  def save_search_link(search)
    link_to_remote content_tag('span', t(:save, :scope => 'user_interface.search')) + image_tag(image_path 'suche_speichern.gif'),
                   options.merge!({ :url => new_search_path(:referring_controller => controller_name, :referring_action => action_name), :method => :get })  
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
  def link_to_segment(segment, match_text='', show_segment_text=false, ajax=false)
    interview = segment.interview
    item = segment.tape.number
    position = segment.start_time.round
    link_text = show_segment_text ? "#{content_tag(:span, "#{segment.timecode}", :class => :timecode)}#{truncate(segment_excerpt_for_match(segment, match_text), :length => 300)}" : "Zum Interview-Ausschnitt"
    if @object.is_a?(Interview) || ajax
      link_to_function link_text, "archiveplayer('interview-player').seek(#{item-1},#{position});"
    else
      link_to link_text, interview_path(interview, :item => item, :position => position)
    end
  end

  def segment_excerpt_for_match(segment, original_query='', width=10)
    # TODO: reduce word count in both directions on interpunctuation
    # handle wildcards
    query_string = original_query.gsub(/\*/,'\w*')
    unless query_string.index(' ').nil?
      # check if an expression matches directly
      r = Regexp.new query_string, Regexp::IGNORECASE
      if (segment.translation[r] || segment.transcript[r]).blank?
        # and multiple expressions
        query_string.gsub!(/([^'"]+)\s+([^'"]+)/,'\1_\2')
        query_string.gsub!(/(\S+)\s+(\S+)/,'\1|\2')
        query_string.gsub!(/(['"])+([^'"]*)\1/,'(\2)')
      end
    end
    query_string.gsub!('_',' ')
    # pattern = Regexp.new '[^\.;]*\W' + (query_string.blank? ? '' : (query_string + '\W+')) + '(\w+\W+){0,' + width.to_s + '}', Regexp::IGNORECASE
    pattern = Regexp.new(('(\w+\W+)?' * width) + (query_string.blank? ? '' : ('(' + query_string + ')\W+')) + '(\w+\W+){0,' + width.to_s + '}', Regexp::IGNORECASE)
    match_text = segment.translation[pattern] || segment.transcript[pattern]
    match_text = if match_text.nil?
      truncate(segment.translation, 180)
    else
      str = ((segment.translation.index(match_text) || segment.transcript.index(match_text)) == 0) ? '' : '&hellip;'
      match_text.gsub!(Regexp.new('(\W|^)(' + query_string + ')', Regexp::IGNORECASE),"\\1<span class='highlight'>\\2</span>")
      "#{str}#{match_text}#{(match_text.last == '.' ? '' : '&hellip;')}"
    end.gsub(/~([^~]*)~/,'<em>\1</em>')
  end

  def zwar_paginate(collection, params=nil)
    params.delete_if{|k,v| v.blank? }
    will_paginate collection,
                  { :previous_label => I18n.t(:previous),
                    :next_label => I18n.t(:next),
                    :params => params
                  }
  end

  def last_import
    $last_import_date ||= begin
      last_import = Import.last.first
      last_import ||= Interview.find(:first, :order => "created_at DESC")
      case last_import
        when Import
          last_import.time
        when Interview
          last_import.created_at
        else
          Time.gm(2010,9,22)
      end
    end
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


  # modal window dialog
  def javascript_open_modal_window(ajax_url, options={})
    params = (options[:parameters] || {}).to_a.map{|p| "#{p.first.to_s}: '#{p.last}'" }.join(', ')
    method = options[:method] || :get
    callback = options[:callback] || ''
    <<JS
$('modal_window').innerHTML = '';
new Effect.Appear('shades', { to: 0.6, duration: 0.4 });
$('ajax-spinner').show;
new Ajax.Updater('modal_window', '#{ajax_url}',
  { parameters: '#{params}',
    method: '#{method}',
    evalScripts: true,
    onFailure: function(){$('ajax-spinner').hide(); new Effect.Fade('shades', { from: 0.6 })},
    onSuccess: function(){$('ajax-spinner').hide(); new Effect.Appear('modal_window', { duration: 0.3 }); $('modal_window').addClassName('edit');#{callback}}
    });
JS
  end

  # This method renders a close button on the lightbox if the current
  # request was engaged by XHTTP.
  def modal_window_close_button_on_javascript_request
    if request.xhr?
      link_to('X', '#', :id => ('modal_window_close'), :onclick => "new Effect.Fade('shades', { from: 0.6, duration: 0.4 }); $('modal_window').hide(); return false;")
    end
  end

end
