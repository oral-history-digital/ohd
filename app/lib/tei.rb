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
      parts = original_text.split(/([\{|\[|<]{1,2}[^\{\[<>\]\}]*[\}|\]|>]{1,2})/).map do |part|
        if part =~ /[\{|\[|<]{1,2}[^\{\[<>\]\}]*[\}|\]|>]{1,2}/
          part
        else
          part.split(/(\?|\.|!|,|:)/).map do |subpart|
            subpart.split
          end
        end
      end.flatten
      parts.each_with_index do |part|
        index_carryover = 1
        case part
        when /<p\d+>/
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
        when /<v\((.*)\)>/
          ordinary_text << {
            content: [:desc, part[/<v\((.*)\)>/,1]],
            index: combined_index,
            type: 'vocal',
            attributes: {rend: part}
          }
        when /<g\s*\(.*\)>/
          ordinary_text << {
            content: [:desc, part[/<g\s*\((.*)\)>/,1]],
            index: combined_index,
            type: 'kinesic'
          }
        when /<g\s*\(.*\) .*>/
          part_ordinary_text, part_comments, index_carryover = Tei.new(part[/<g\s*\((.*)\) (.*)>/,2], combined_index).tokenized_text
          comments << {
            content: part[/<g\s*\((.*)\) (.*)>/,1],
            index_from: combined_index,
            index_to: combined_index + index_carryover - 1,
            type: 'kinestic'
          }
          comments.concat(part_comments)
          ordinary_text.concat(part_ordinary_text)
        when /<.*>/
          comments << {
            content: part,
            index_from: combined_index,
            index_to: combined_index + 1,
            type: part[/<(\w+).*/,1]
          }
        when /[\{|\[]{1,2}[^\{\[\]\}]*[\}|\]]{1,2}/
          comments << {
            content: part,
            index_from: combined_index,
            index_to: combined_index + 1,
            type: "za"
          }
        when /(\?|\.|!|,|:)/
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
        combined_index += index_carryover
      end
    end

    [ordinary_text, comments, index_carryover = parts.size]
  end
end
