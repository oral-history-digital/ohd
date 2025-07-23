module Segment::TokenizedText

  def tokenized_text(locale)
    ordinary_text = []
    comments = []

    unless text(locale).blank?
      parts = text(locale).split(/([\{|\[|<]{1,2}[^\{\[<>\]\}]*[\}|\]|>]{1,2})/).map do |part|
        if part =~ /[\{|\[|<]{1,2}[^\{\[<>\]\}]*[\}|\]|>]{1,2}/
          part
        else
          part.split(/(\?|\.|!|,|:)/).map do |subpart|
            subpart.split
          end
        end
      end.flatten
      parts.each_with_index do |part, index|
        case part
        when /<p\d+>/
          ordinary_text << {index: index, type: 'pause', attributes: {rend: part, dur: "PT#{part[/(\d+)/,1]}.0S"}}
        when /<.*>/
          comments << {content: part, index: index, type: part[/<(\w+).*/,1]}
        when /[\{|\[]{1,2}[^\{\[\]\}]*[\}|\]]{1,2}/
          comments << {content: part, index: index, type: "za"}
        when /(\?|\.|!|,|:)/
          ordinary_text << {content: part, index: index, type: :pc}
        else
          ordinary_text << {content: part, index: index, type: :w}
        end
      end
    end

    [ordinary_text, comments]
  end

end
