namespace :segments do
  desc "Unify all segment timecodes to HH:MM:SS.mmm format"
  task unify_timecodes: :environment do
    FRAME_RATE = 25.0

    def frames_to_ms(frames)
      ((frames.to_f / FRAME_RATE) * 1000).round
    end

    def normalize_timecode(tc)
      return nil if tc.blank?

      # Strip whitespace
      tc = tc.strip

      # Remove < > signs
      tc = tc.gsub(/[<>]/, '')

      # Replace - with 0
      tc = tc.gsub('-', '0')

      # Strip again in case removing chars left spaces
      tc = tc.strip

      # HH:MM:SS:XXX (three digits after last colon -> just replace last : with .)
      if tc.match?(/\A\d{1,2}:\d{2}:\d{2}:\d{3}\z/)
        tc = tc.sub(/:(\d{3})\z/, '.\1')
      # HH:MM:SS:XX (two digits after last colon -> frames, replace : with . and convert)
      elsif tc.match?(/\A\d{1,2}:\d{2}:\d{2}:\d{2}\z/)
        frames = tc[-2..].to_i
        ms = frames_to_ms(frames)
        tc = "#{tc[0..-4].sub(/:(\d{2})\z/, '')}#{format('%03d', ms)}"
        # Rebuild properly
        parts = tc.split(':')
        # parts might be wrong, redo:
      # HH:MM:SS.XX (two digits after dot -> frames, convert to ms)
      elsif tc.match?(/\A\d{1,2}:\d{2}:\d{2}\.\d{2}\z/)
        frames = tc[-2..].to_i
        ms = frames_to_ms(frames)
        tc = "#{tc[0..-3]}#{format('%03d', ms)}"
      # HH:MM:SS (no ms at all -> add .000)
      elsif tc.match?(/\A\d{1,2}:\d{2}:\d{2}\z/)
        tc = "#{tc}.000"
      # HH:MM:SS.mmm (already correct format)
      elsif tc.match?(/\A\d{1,2}:\d{2}:\d{2}\.\d{3}\z/)
        # already fine
      end

      # Handle HH:MM:SS:XX again more robustly (colon-separated frames)
      if tc.match?(/\A(\d{1,2}):(\d{2}):(\d{2}):(\d{2})\z/)
        h, m, s, fr = $1, $2, $3, $4
        ms = frames_to_ms(fr.to_i)
        tc = "#{h}:#{m}:#{s}.#{format('%03d', ms)}"
      end

      # Fix single-digit hour (e.g., "0:12:34.000" -> "00:12:34.000")
      if tc.match?(/\A(\d):/)
        tc = "0#{tc}"
      end

      tc
    end

    updated = 0
    errors = []

    Segment.where.not("timecode REGEXP ?", '^\\d{2}:\\d{2}:\\d{2}\\.\\d{3}$').find_each do |segment|
      new_timecode = normalize_timecode(segment.timecode)

      changes = {}
      changes[:timecode] = new_timecode if new_timecode && new_timecode != segment.timecode

      if changes.any?
        begin
          segment.update_columns(changes)
          updated += 1
          puts "Segment ##{segment.id}: #{changes.map { |k, v| "#{k}: '#{segment.send("#{k}_before_last_save") rescue segment[k]}' -> '#{v}'" }.join(', ')}"
        rescue => e
          errors << "Segment ##{segment.id}: #{e.message}"
        end
      end
    end

    puts "\n#{updated} segments updated."
    puts "#{errors.size} errors:" if errors.any?
    errors.each { |e| puts "  #{e}" }
  end
end
