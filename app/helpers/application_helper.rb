# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

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
    position = Timecode.new(segment.raw_timecode).time.to_i
    link_text = show_segment_text ? content_tag(:span, "#{segment.timecode}", :class => :timecode) + truncate(segment_excerpt_for_match(segment, match_text), :length => 300) : "Zum Interview-Ausschnitt"
    if @object.is_a?(Interview) || ajax
      link_to link_text, "javascript:currentPlayer.seek(#{item-1},#{position});"
    else
      link_to link_text, interview_path(interview, :item => item, :position => position)
    end
  end

  def segment_excerpt_for_match(segment, original_query='', width=8)
    #return segment.translation # TODO: remove this - it's for debugging search only'
    # TODO: reduce word count in both directions on interpunctuation
    # handle wildcards
    query_string = original_query.gsub(/\*/,'\w*')
    # and multiple expressions
    query_string.gsub!(/([^'"]+)\s+([^'"]+)/,'\1_\2')
    query_string.gsub!(/(\S+)\s+(\S+)/,'\1|\2')
    query_string.gsub!('_',' ')
    query_string.gsub!(/(['"])+([^'"]*)\1/,'(\2)')
    pattern = Regexp.new '[^\.;]*\W' + (query_string.blank? ? '' : (query_string + '\W+')) + '(\w+\W+){0,' + width.to_s + '}', Regexp::IGNORECASE
    match_text = segment.translation[pattern] || segment.transcript[pattern]
    match_text = if match_text.nil?
      'keine Transkription vorhanden.'
    else
      match_text.gsub!(Regexp.new(query_string, Regexp::IGNORECASE),"<span class='highlight'>\\0</span>")
      '&hellip;' + match_text + (match_text.last == '.' ? '' : '&hellip;')
    end
  end

  def zwar_paginate(collection)
    will_paginate collection,
                  { :previous_label => I18n.t(:previous),
                    :next_label => I18n.t(:next)
                  }
  end

end
