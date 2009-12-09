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

  # Conditionally splits segment transcripts into smaller parts.
  # This method returns an array of the format [ transcript, translation ], both
  # parts may be broken down into another 2-element array if the segment is split,
  # or just contain the original strings when no splitting takes place.
  def split_segment(segment, limit)
    original_transcript = segment.transcript || ''
    original_translation = segment.translation || ''
    if original_transcript.length > limit || original_translation.length > limit

      scan_regexp = /[^.,;]*[.,;]{1}/
      transcript_parts = original_transcript.strip.scan(scan_regexp)
      translation_parts = original_translation.strip.scan(scan_regexp)

      # split by word if there are no punctuation stops
      if transcript_parts.size < 2 || translation_parts.size < 2
        transcript_parts = original_transcript.strip.scan(/\S+/)
        translation_parts = original_translation.strip.scan(/\S+/)
      end
      transcript = ''
      translation = ''
      length = 0

      while ((length < limit) and (!transcript_parts.empty? && !translation_parts.empty?)) do
        transcript << (transcript_parts.shift + ' ')
        translation << (translation_parts.shift + ' ')
        next_transcript_size = transcript.length + (transcript_parts.first || '').length
        next_translation_size = translation.length + (translation_parts.first || '').length
        length = (next_transcript_size > next_translation_size) ? next_transcript_size : next_translation_size
      end
      
      # return an array of transcript / translation parts
      [ [transcript.strip, transcript_parts.join(' ').strip ], [ translation.strip, translation_parts.join(' ').strip ] ]

    else

      # return the originals
      [ original_transcript.strip, original_translation.strip ]

    end
  end

end
