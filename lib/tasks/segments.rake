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
        separator = components[4]
        fraction = components[5]
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

  desc 'Unify known segment timecodes to HH:MM:SS.mmm (DRY_RUN=true previews without writes)'
  task unify_timecodes: :environment do
    require Rails.root.join('lib/maintenance/legacy_timecode_normalizer').to_s
    dry_run = ENV['DRY_RUN'] == 'true'
    puts 'Dry run: no database changes will be made.' if dry_run
    updated = 0
    would_change = 0
    unchanged = 0
    rejected = 0
    failed = 0

    Segment.select(:id, :timecode).find_each do |segment|
      original = segment.timecode
      begin
        normalized = Maintenance::LegacyTimecodeNormalizer.normalize(original)
      rescue ArgumentError => e
        rejected += 1
        puts "Rejected segment ##{segment.id}: #{original.inspect} (#{e.message})"
        next
      end

      if normalized == original
        unchanged += 1
        next
      end

      if dry_run
        would_change += 1
        puts "Would update segment ##{segment.id}: #{original.inspect} -> #{normalized.inspect}"
        next
      end

      begin
        unless segment.update_columns(timecode: normalized)
          raise ActiveRecord::RecordNotSaved, 'Timecode update returned false'
        end

        updated += 1
        puts "Segment ##{segment.id}: #{original.inspect} -> #{normalized.inspect}"
      rescue ActiveRecord::ActiveRecordError => e
        failed += 1
        puts "Failed segment ##{segment.id}: #{original.inspect} (#{e.message})"
      end
    end

    result = dry_run ? "#{would_change} segments would change" : "#{updated} segments updated"
    puts "\n#{result}; #{unchanged} unchanged; #{rejected} rejected; #{failed} failed."
  end
end
