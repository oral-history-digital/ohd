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

    types_map = {
      'g' => 'kinesic',
      's' => 'vocal',
      'v' => 'vocal',
    }

    unless original_text.blank?
      parts = parse_nested_tags(original_text).map do |part|
        if is_tag?(part)
          part
        else
          part.split(/(\?|…|\.\.\.|\.|!|,|:)/).map do |subpart|
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
        when /\{?\[(.*)\]\}?/, /\{\((.*)\)\}/, /\{(.*)\}/
          ordinary_text << {
            content: [:desc, $1, {rend: part}],
            index: combined_index,
            type: 'incident',
          }
        when /^<n\((.*)\)>$/
          #<note rend="<n(1989)>">1989</note>
          ordinary_text << {
            content: $1,
            index: combined_index,
            type: 'note',
            attributes: {rend: part}
          }
        #when /^<([s|v|g])\s*\((.*)\)>$/
        when /^<(\w+)\s*\((.*)\)>$/
          ordinary_text << {
            content: [:desc, $2, {rend: part}],
            index: combined_index,
            type: types_map[$1] || $1
          }
        when /^<sim .+>$/
          # Handle simultaneity tags with content (like <sim Nichts, nichts,>)
          part_ordinary_text, part_index_carryover = parse_simultaneity_tag(part, combined_index)
          ordinary_text.concat(part_ordinary_text)
          index_carryover = part_index_carryover
        when /^<\?.+>$/
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
        when "(???)"
          ordinary_text << {
            index: combined_index,
            type: 'gap',
            attributes: {rend: '(???)', reason: 'unintelligible'}
          }
        when /^\(.+\?\)$/
          # Handle uncertainty tags with a question (like (By now?))
          ordinary_text << {
            content: part[/^\((.+)\?\)$/,1],
            index: combined_index,
            type: 'w',
            attributes: {type: 'uncertain'}
          }
        when /^<res\s+.*>$/
          # <gap reason="not published"/>
          ordinary_text << {
            index: combined_index,
            type: 'gap',
            attributes: {reason: 'not published'}
          }
        when "...", "…"
          # Handle ellipsis
          # <pc type='ellipsis'>
          ordinary_text << {
            content: '...',
            index: combined_index,
            type: 'w',
            attributes: {type: 'ellipsis'}
          }
        when /^<(\w+)\s*\(([^)]+)\)\s+(.+)>$/
          content = $3.strip
          part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, combined_index).tokenized_text
          ordinary_text.concat(part_ordinary_text)
          comments << {
            content: $2.strip,
            index_from: combined_index,
            index_to: combined_index + part_index_carryover - 1,
            type: types_map[$1] || $1
          }
          comments.concat(part_comments)
          index_carryover = part_index_carryover
        when /^<.*>$/
          from, to = get_from_to(parts, combined_index, index)
          comments << {
            content: part,
            index_from: from,
            index_to: to,
            type: part[/<(\w+).*/,1]
          }
        when /^[\{|\[]{1,2}[^\{\[\]\}]*[\}|\]]{1,2}$/
          from, to = get_from_to(parts, combined_index, index)
          comments << {
            content: part,
            index_from: from,
            index_to: to,
            type: "za"
          }
        when /^(\?|\.|!|,|:|\-)$/
          ordinary_text << {
            content: part.strip, # Remove extra spaces
            index: combined_index,
            type: :pc
          }
        when /^(\p{Letter}+\_)$/
          ordinary_text << {
            content: part.chop,
            index: combined_index,
            type: :w,
            attributes: {type: 'cut-off'}
          }
        when /^~\p{Letter}+~$/
          ordinary_text << {
            content: part[1..-2], # Remove the surrounding tildes
            index: combined_index,
            type: :w,
            attributes: {type: 'transfer'}
          }
        else
          ordinary_text << {
            content: part.strip, # Remove extra spaces
            index: combined_index,
            type: :w
          }
        end
        index += 1
        combined_index += index_carryover
      end
      
      [ordinary_text, comments, ordinary_text.size]
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
      when '<', '{', '[', '('
        if bracket_depth == 0 && !current_part.empty?
          # Save the previous non-tag part
          parts << current_part
          current_part = ""
        end
        current_part += char
        bracket_depth += 1
      when '>', '}', ']', ')'
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
    part =~ /^[\{|\[|<\(]/
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
      index: start_index + index_carryover,
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
    index_carryover = 0

    # Extract content inside <? ...>
    if tag =~ /^<\?(.+)>$/
      content = $1.strip
      part_ordinary_text, part_comments, part_index_carryover = Tei.new(content, start_index).tokenized_text
      ordinary_text_parts = part_ordinary_text.map do |part|
        if part[:attributes].nil?
          part[:attributes] = {type: 'uncertain'}
        else
          part[:attributes].merge!(type: ['uncertain', part[:attributes][:type].to_s].join(' '))
        end
        part
      end
      #comments.concat(part_comments)
      index_carryover = part_index_carryover
    end
    
    [ordinary_text_parts, index_carryover]
  end

  def get_from_to(parts, combined_index, index)
    if index == parts.length - 1
      from = to = combined_index -1
    else
      from = combined_index
      to = combined_index + 1
    end
    [from, to]
  end

end
