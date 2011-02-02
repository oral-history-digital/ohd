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

  def current_search_path
    url_for(@search.query_params.merge({:controller => :searches, :action => :new}))
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
      link_to link_text, "javascript:currentPlayer.seek(#{item-1},#{position});"
    else
      link_to link_text, interview_path(interview, :item => item, :position => position)
    end
  end

  def segment_excerpt_for_match(segment, original_query='', width=10)
    #return segment.translation # TODO: remove this - it's for debugging search only'
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
    pattern = Regexp.new(('(\w+\W+)?' * width) + (query_string.blank? ? '' : (query_string + '\W+')) + '(\w+\W+){0,' + width.to_s + '}', Regexp::IGNORECASE)
    match_text = segment.translation[pattern] || segment.transcript[pattern]
    match_text = if match_text.nil?
      truncate(segment.translation, 180)
    else
      str = ((segment.translation.index(match_text) || segment.transcript.index(match_text)) == 0) ? '' : '&hellip;'
      match_text.gsub!(Regexp.new('(\W|^)(' + query_string + ')', Regexp::IGNORECASE),"\\1<span class='highlight'>\\2</span>")
      "#{str}#{match_text}#{(match_text.last == '.' ? '' : '&hellip;')}"
    end
  end

  def zwar_paginate(collection)
    will_paginate collection,
                  { :previous_label => I18n.t(:previous),
                    :next_label => I18n.t(:next)
                  }
  end

end
