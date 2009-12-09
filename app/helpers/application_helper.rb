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
  # This method returns an array of the format [[ time, transcript, translation ], ...],
  # with multiple elements if splitting takes place.
  def split_segment(segment, character_limit, carryover=0)
    result = []
    remaining_transcript = segment.transcript || ''
    remaining_translation = segment.translation || ''

    time = Timecode.new(segment.timecode).time
    duration = segment.duration
    
    original_transcript_length = remaining_transcript.length

    while(!remaining_transcript.blank? && !remaining_translation.blank?)

      # we might have a partial previous segment which we can concatenate to
      limit = character_limit - carryover

      if remaining_transcript.length > limit || remaining_translation.length > limit

        scan_regexp = /[^.,;]*[.,;]{1}/
        transcript_parts = remaining_transcript.strip.scan(scan_regexp)
        translation_parts = remaining_translation.strip.scan(scan_regexp)

        # split by word if there are no punctuation stops
        if transcript_parts.size < 2 || translation_parts.size < 2
          transcript_parts = remaining_transcript.strip.scan(/\S+/)
          translation_parts = remaining_translation.strip.scan(/\S+/)
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
        current_time = (time * 10.0).round / 10.0
        result << [ current_time, transcript.strip, translation.strip ]

        remaining_transcript = transcript_parts.join(' ')
        remaining_translation = translation_parts.join(' ')

        time = current_time + (transcript.length.to_f / original_transcript_length.to_f * duration)

      else

        # return the originals
        current_time = (time * 10.0).round / 10.0
        result << [ current_time, remaining_transcript.strip, remaining_translation.strip ]

        remaining_transcript = remaining_translation = ''

      end

    end

    result

  end

end
