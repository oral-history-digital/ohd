class Tei

  attr_accessor :original_text, :start_index

  def initialize(original_text, start_index = 0)
    @original_text = original_text
    @start_index = start_index.to_i
  end

  def tokenized_text
    ordinary_text = []
    comments = []
    combined_index = start_index

    unless original_text.blank?
      parts = parse_nested_tags(original_text).map do |part|
        if is_tag?(part)
          part
        else
          part.split(/(\?|\.|!|,|:)/).map do |subpart|
            subpart.split
          end
        end
      end.flatten
      
      index = 0
      while index < parts.length
        part = parts[index]
        index_carryover = 1
        case part
        when /^<p\d+>$/
          ordinary_text << {
            index: combined_index,
            type: 'pause',
            attributes: {rend: part, dur: "PT#{part[/(\d+)/,1]}.0S"}
          }
        when "[---]"
          ordinary_text << {
            index: combined_index,
            type: 'pause',
            attributes: {type: 'long'}
          }
        when /\[\w+\]/
          ordinary_text << {
            content: [:desc, part[/\[\(\w+\)\]/,1]],
            index: combined_index,
            type: 'incident',
            attributes: {rend: part}
          }
        when /^<v\s*\(.+\) .+>$/
          # Handle vocal tags with content (like <v(inner) some text>)
          vocal_desc, content = parse_vocal_tag_with_content(part)
          if vocal_desc && content
            part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, combined_index).tokenized_text
            comments << {
              content: vocal_desc,
              index_from: combined_index,
              index_to: combined_index + part_index_carryover - 1,
              type: 'vocal'
            }
            comments.concat(part_comments)
            ordinary_text.concat(part_ordinary_text)
            index_carryover = part_index_carryover
          else
            # Fallback to treating as simple vocal tag
            ordinary_text << {
              content: [:desc, part[/<v\s*\((.*)\)>/,1]],
              index: combined_index,
              type: 'vocal',
              attributes: {rend: part}
            }
          end
        when /^<v\((.*)\)>$/
          ordinary_text << {
            content: [:desc, part[/<v\((.*)\)>/,1]],
            index: combined_index,
            type: 'vocal',
            attributes: {rend: part}
          }
        when /^<s\s*\(.+\) .+>$/
          # Handle speech tags with content (like <s(gedehnt) Na ja,>)
          speech_desc, content = parse_speech_tag_with_content(part)
          if speech_desc && content
            part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, combined_index).tokenized_text
            comments << {
              content: speech_desc,
              index_from: combined_index,
              index_to: combined_index + part_index_carryover - 1,
              type: 'speech'
            }
            comments.concat(part_comments)
            ordinary_text.concat(part_ordinary_text)
            index_carryover = part_index_carryover
          else
            # Fallback to treating as generic tag if parsing fails
            comments << {
              content: part,
              index_from: combined_index,
              index_to: combined_index + 1,
              type: part[/<(\w+).*/,1] || 'unknown'
            }
          end
        when /^<s\s*\(.*\)>$/
          # Handle speech tags without content (like <s(gedehnt)>)
          ordinary_text << {
            content: [:desc, part[/<s\s*\((.*)\)>/,1]],
            index: combined_index,
            type: 'speech'
          }
        when /^<g\s*\(.+\) .+>$/
          # Handle kinesic tags with content (potentially nested) - must come before simpler <g(...)> pattern
          gesture_desc, content = parse_kinesic_tag_with_content(part)
          if gesture_desc && content
            part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, combined_index).tokenized_text
            comments << {
              content: gesture_desc,
              index_from: combined_index,
              index_to: combined_index + part_index_carryover - 1,
              type: 'kinestic'
            }
            comments.concat(part_comments)
            ordinary_text.concat(part_ordinary_text)
            index_carryover = part_index_carryover
          else
            # Fallback to treating as generic tag if parsing fails
            comments << {
              content: part,
              index_from: combined_index,
              index_to: combined_index + 1,
              type: part[/<(\w+).*/,1] || 'unknown'
            }
          end
        when /^<g\s*\(.*\)>$/
          ordinary_text << {
            content: [:desc, part[/<g\s*\((.*)\)>/,1]],
            index: combined_index,
            type: 'kinesic'
          }
        when /^<n\((.*)\)>$/
          #<note rend="<n(1989)>">1989</note>
          ordinary_text << {
            content: part[/<n\((.*)\)>/,1],
            index: combined_index,
            type: 'note',
            attributes: {rend: part}
          }
        when /^<sim .+>$/
          # Handle simultaneity tags with content (like <sim Nichts, nichts,>)
          part_ordinary_text, part_index_carryover = parse_simultaneity_tag(part, combined_index)
          ordinary_text.concat(part_ordinary_text)
          index_carryover = part_index_carryover
        when /^<\? .+>$/
          # Handle transcriber uncertainty tags with content (like <? Da hat es>)
          part_ordinary_text, part_index_carryover = parse_uncertainty_tag(part, combined_index)
          ordinary_text.concat(part_ordinary_text)
          index_carryover = part_index_carryover
        when /^<=>$/
          ordinary_text << {
            content: parts[index + 1] || '',
            index: combined_index,
            type: 'w',
            attributes: {type: 'latching'}
          }
          index += 1 # Skip the next part since it's already included
        when /^\(.+\)$/
          ordinary_text << {
            content: part[/^\(.+\)$/,1],
            index: combined_index,
            type: 'w',
            attributes: {type: 'uncertain'}
          }
        when "(???)"
          ordinary_text << {
            index: combined_index,
            type: 'gap',
            attributes: {rend: '(???)', reason: 'unintelligible'}
          }
        when /^<res\s+.*>$/
          # <gap reason="not published"/>
          ordinary_text << {
            index: combined_index,
            type: 'gap',
            attributes: {reason: 'not published'}
          }
        when /^<.*>$/
          comments << {
            content: part,
            index_from: combined_index,
            index_to: combined_index + 1,
            type: part[/<(\w+).*/,1]
          }
        when /^[\{|\[]{1,2}[^\{\[\]\}]*[\}|\]]{1,2}$/
          comments << {
            content: part,
            index_from: combined_index,
            index_to: combined_index + 1,
            type: "za"
          }
        when /^(\?|\.|!|,|:)$/
          ordinary_text << {
            content: part,
            index: combined_index,
            type: :pc
          }
        else
          ordinary_text << {
            content: part,
            index: combined_index,
            type: :w
          }
        end
        index += 1
        combined_index += index_carryover
      end
      
      [ordinary_text, comments, parts.size]
    else
      [ordinary_text, comments, 0]
    end
  end

  private

  # Parse nested tags correctly by tracking bracket depth
  def parse_nested_tags(text)
    parts = []
    current_part = ""
    bracket_depth = 0
    i = 0
    
    while i < text.length
      char = text[i]
      
      case char
      when '<', '{', '['
        if bracket_depth == 0 && !current_part.empty?
          # Save the previous non-tag part
          parts << current_part
          current_part = ""
        end
        current_part += char
        bracket_depth += 1
      when '>', '}', ']'
        current_part += char
        bracket_depth -= 1
        
        if bracket_depth == 0
          # We've closed the outermost tag
          parts << current_part
          current_part = ""
        end
      else
        current_part += char
      end
      
      i += 1
    end
    
    # Add any remaining part
    parts << current_part unless current_part.empty?
    
    parts.reject(&:empty?)
  end

  # Check if a part is a tag (starts with <, {, or [)
  def is_tag?(part)
    part =~ /^[\{|\[|<]/
  end

  # Parse kinesic tags with content, handling nested structures
  # Input: "<g(description) content with <nested> tags>"
  # Output: ["description", "content with <nested> tags"]
  def parse_kinesic_tag_with_content(tag)
    # Match the opening <g( part
    if tag =~ /^<g\s*\(([^)]+)\)\s+(.+)>$/
      description = $1
      content = $2
      return [description, content]
    end
    
    nil
  end

  # Parse speech tags with content, handling nested structures
  # Input: "<s(description) content>"
  # Output: ["description", "content"]
  def parse_speech_tag_with_content(tag)
    # Match the opening <s( part
    if tag =~ /^<s\s*\(([^)]+)\)\s+(.+)>$/
      description = $1
      content = $2
      return [description, content]
    end
    
    nil
  end

  # Parse vocal tags with content, handling nested structures
  # Input: "<v(description) content>"
  # Output: ["description", "content"]
  def parse_vocal_tag_with_content(tag)
    # Match the opening <v( part
    if tag =~ /^<v\s*\(([^)]+)\)\s+(.+)>$/
      description = $1
      content = $2
      return [description, content]
    end
    
    nil
  end

  # Parse simultaneity tags, handling nested structures
  # Input: "<sim content>"
  # Output: [ordinary_text_parts, index_carryover]
  def parse_simultaneity_tag(tag, start_index)
    ordinary_text_parts = [{
        index: start_index,
        type: :anchor,
        attributes: {type: 'SIM-START'}
    }]
    index_carryover = 1

    # Extract content inside <sim ...>
    if tag =~ /^<sim\s+(.+)>$/
      content = $1.strip
      part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, start_index + 1).tokenized_text
      ordinary_text_parts.concat(part_ordinary_text)
      #comments.concat(part_comments)
      index_carryover = part_index_carryover + 1 # +1 for the <sim> tag itself
    end

    ordinary_text_parts << {
      index: index_carryover,
      type: :anchor,
      attributes: {type: 'SIM-END'}
    }
    
    [ordinary_text_parts, index_carryover + 1]
  end

  # Parse uncertainty tags, handling nested structures
  # Input: "<? content>"
  # Output: [ordinary_text_parts, index_carryover]
  def parse_uncertainty_tag(tag, start_index)
    ordinary_text_parts = []
    index_carryover = 1

    # Extract content inside <? ...>
    if tag =~ /^<\?\s+(.+)>$/
      content = $1.strip
      part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, start_index + 1).tokenized_text
      ordinary_text_parts = part_ordinary_text.map do |part|
        part[:attributes] = {type: 'uncertain'}
        part
      end
      #comments.concat(part_comments)
      index_carryover = part_index_carryover
    end
    
    [ordinary_text_parts, index_carryover]
  end
end
