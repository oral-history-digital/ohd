namespace :segments do
  desc 'Report nonstandard segment timecodes without changing data (CSV_PATH=path for CSV export)'
  task audit_timecodes: :environment do
    require 'csv'
    groups = Hash.new { |hash, key| hash[key] = [] }
    findings = []
    projects = Project.all.index_by(&:id)
    total = 0
    standard = 0
    Segment.joins(:interview).select(
      'segments.id, segments.timecode, interviews.archive_id AS audit_archive_id, interviews.project_id AS audit_project_id'
    ).find_each do |segment|
      total += 1
      raw = segment.timecode
      # Standard timecode format is HH:MM:SS.mmm
      # Match elapsed hours (at least two digits, no extra zeros), valid MM:SS, and three millisecond digits.
      if raw&.match?(/\A(?:\d{2}|[1-9]\d{2,}):[0-5]\d:[0-5]\d\.\d{3}\z/)
        standard += 1
        next
      end

      value = raw.to_s.strip
      labels = []
      labels << 'surrounding whitespace' if raw && raw != value
      # Detect and remove a leading numeric tape marker such as "[1] " for classification.
      labels << 'tape prefix' if value.sub!(/\A\[\d+\]\s*/, '')
      # Capture numeric H:M:S components of any width and an optional fractional suffix.
      components = /\A(\d+):(\d+):(\d+)(?:([.,:])(\d+))?\z/.match(value)
      if components
        %w[hours minutes seconds].each_with_index do |name, index|
          digits = components[index + 1]
          hours = index.zero?
          if digits.length > 2 && digits.start_with?('0') && (hours || digits.to_i <= 59)
            labels << "extra leading zeros in #{name}"
          elsif digits.length < 2 || (!hours && digits.length != 2)
            labels << "nonstandard #{name} width"
          end
          labels << "invalid #{name}" if !hours && digits.to_i > 59
        end
        separator, fraction = components[4], components[5]
        labels << 'comma separator' if separator == ','
        if fraction.nil?
          labels << 'missing milliseconds'
        elsif fraction.length == 2
          labels << (fraction.to_i < 25 ? 'likely frames (25 fps; ambiguous)' : 'two fractional digits outside 25 fps frame range')
        elsif fraction.length != 3
          labels << 'other fractional precision or separator'
        elsif separator == ':'
          labels << 'colon-separated milliseconds'
        end
      else
        labels << (value.empty? ? 'empty' : 'unrecognized')
      end
      project = projects.fetch(segment.audit_project_id)
      url = "#{project.domain_with_optional_identifier}/#{project.default_locale}/interviews/#{segment.audit_archive_id}"
      row = [segment.id, segment.audit_archive_id, segment.audit_project_id, raw, project.shortname, url]
      findings << [labels.join(' | '), *row]
      labels.each { |label| groups[label] << row }
    end

    puts "Scanned: #{total}; standard: #{standard}; nonstandard: #{total - standard}"
    puts 'Nonstandard counts represent unique segments; category counts overlap.'
    groups.sort.each do |type, rows|
      puts "\n#{type}: #{rows.length}"
      rows.first(5).each do |id, archive_id, project_id, timecode, shortname, url|
        puts "  segment=#{id} archive_id=#{archive_id.inspect} project_id=#{project_id} timecode=#{timecode.inspect} project_shortname=#{shortname} url=#{url}"
      end
      puts "  ... #{rows.length - 5} more" if rows.length > 5
    end
    puts "\nShowing up to 5 examples per group. Export all findings with CSV_PATH=tmp/timecode_audit.csv bundle exec rails segments:audit_timecodes"

    if ENV['CSV_PATH'].present?
      CSV.open(ENV['CSV_PATH'], 'w', encoding: 'UTF-8') do |csv|
        csv << %w[issues segment_id archive_id project_id timecode project_shortname interview_url]
        findings.each { |row| csv << row }
      end
      puts "CSV written to #{ENV['CSV_PATH']}"
    end
  end

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

      # HH:MM:SS:XXXX (four digits after last colon -> just replace cut off last digit)
      if tc.match?(/\A\d{2}:\d{2}:\d{2}.\d{4}\z/)
        tc = tc[0..-2]
      # HH:MM:SS:XXX (three digits after last colon -> just replace last : with .)
      elsif tc.match?(/\A\d{1,2}:\d{2}:\d{2}:\d{3}\z/)
        tc = tc.sub(/:(\d{3})\z/, '.\1')
      # HH:MM:SS:XX (two digits after last colon -> frames, replace : with . and convert)
      elsif tc.match?(/\A\d{1,2}:\d{2}:\d{2}:\d{2}\z/)
        frames = tc[-2..].to_i
        ms = frames_to_ms(frames)
        tc = "#{tc.sub(/:(\d{2})\z/, '')}#{format('%03d', ms)}"
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
