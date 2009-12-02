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

end
