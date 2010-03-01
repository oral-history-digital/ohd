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
  def link_to_segment(segment, match_text='', show_segment_text=false)
    interview = segment.interview
    item = segment.tape.number
    position = Timecode.new(segment.timecode).time.to_i
    link_text = show_segment_text ? content_tag(:span, "#{segment.timecode}", :class => :timecode) + truncate(segment_excerpt_for_match(segment, match_text), :length => 300) : "Zum Interview-Ausschnitt"
    if @object.is_a?(Interview)
      link_to link_text, "javascript:current_player.seek(#{item-1},#{position});"
    else
      link_to link_text, interview_path(interview, :item => item, :position => position)
    end
  end

  def segment_excerpt_for_match(segment, match_text='', width=8)
    return segment.translation # TODO: remove this - it's for debugging search only'
    # TODO: reduce word count in both directions on interpunctuation
    pattern = Regexp.new '(\w+\W+){0,' + width.to_s + '}' + (match_text.blank? ? '' : (match_text + '\W+')) + '(\w+\W+){0,' + width.to_s + '}', Regexp::IGNORECASE
    match_text = segment.translation[pattern] || segment.transcript[pattern]
    match_text = if match_text.nil?
      'keine Transkription vorhanden.'
    else
      '&hellip;' + match_text + (match_text.last == '.' ? '' : '&hellip;')
    end
  end

end
