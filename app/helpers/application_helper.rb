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
  def link_to_segment(segment, show_segment_text=false)
    interview = segment.interview
    item = segment.tape.number
    position = Timecode.new(segment.timecode).time.to_i
    link_text = show_segment_text ? "#{segment.timecode} " + truncate(segment.translation || segment.transcript || 'keine Transkription vorhanden.', :length => 300) : "Zum Interview-Ausschnitt"
    if @object.is_a?(Interview)
      link_to link_text, "javascript:current_player.seek(#{item-1},#{position});"
    else
      link_to link_text, interview_path(interview, :item => item, :position => position)
    end
  end

end
