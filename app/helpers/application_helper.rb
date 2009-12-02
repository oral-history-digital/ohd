# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  # Formats attributes for display
  def format_value(value)
    case value
    when Timecode
      value.minimal
    when Array
      value.map{|v| v.to_s }.join(', ')
    when Hash
      value.values.map{|v| v.to_s}.join(', ')
    when Numeric
      value.to_s.rjust(3, ' ')
    else
      value.to_s
    end
  end

end
