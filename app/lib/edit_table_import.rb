# frozen_string_literal: true

# Validates edit-table CSV rows and imports transcript data or references in one transaction.
class EditTableImport
  attr_accessor :file_path, :sheet, :interview, :contributions,
                :original_locale, :only_references, :locale

  # @param interview [Interview] Authorized destination interview
  # @param file_path [String] Uploaded CSV path
  # @param locale [String] Header language
  # @param only_references [Boolean] Whether to update existing segment references
  # @param options [Hash] Contribution updates
  def initialize(interview, file_path, locale, only_references = false, **options)
    @interview = interview
    @contributions = @interview.contributions_hash
    @original_locale = @interview.alpha3
    @file_path = file_path
    @locale = locale
    @only_references = only_references
    @options = options
    @sheet = parse_sheet
  end

  def parse_sheet
    csv = Roo::Spreadsheet.open(file_path, { csv_options: CSV_OPTIONS })
    csv = Roo::Spreadsheet.open(file_path, { csv_options: CSV_OPTIONS.merge(col_sep: ';') }) if csv.first.length == 1

    csv.sheet('default').parse(interview.edit_table_headers(locale))
  end

  # Validates every row before applying the table in one transaction.
  # @return [void]
  # @raise [Timecode::ImportFormatError] If timestamps or target segments are invalid
  def process
    # Combine indexing requests and enqueue them only after the import commits.
    RefreshSearchIndexJob.batch do
      interview.with_lock(requires_new: true) do
        (@options[:contributions_attributes] || {}).each_value do |attributes|
          interview.contributions.find(attributes[:id]).update!(speaker_designation: attributes[:speaker_designation])
        end
        self.contributions = interview.contributions_hash
        validate_rows!
        unless only_references
          interview.tapes.each(&:destroy!)
          interview.find_or_create_tapes(sheet.map { |row| row[:tape_number].to_i }.max)
        end
        import_rows
        interview.touch
      end
    end
  end

  # Writes prevalidated rows and raises on failed writes.
  # @return [void]
  def import_rows
    sheet.each do |row|
      unless only_references
        speaker_id = contributions.key(row[:speaker_designation])

        translations_attributes = []
        (interview.alpha3s | interview.project.available_locales.map{|l| ISO_639.find(l).alpha3}).each do |locale|
          text = nil
          if locale == original_locale
            text = row[:transcript]
          else
            text = row["translation_#{locale}".to_sym]
          end

          translations_attributes << {
            locale: locale,
            text: text,
            mainheading: row["mainheading_#{locale}".to_sym],
            subheading: row["subheading_#{locale}".to_sym],
          } if text || row["mainheading_#{locale}".to_sym] || row["subheading_#{locale}".to_sym]
        end

        segment = Segment.create!(
          interview_id: interview.id,
          tape_id: interview.tapes.where(number: row[:tape_number]).first.id,
          speaker_id: speaker_id,
          timecode: row[:timecode],
          translations_attributes: translations_attributes
        )
        segment.update_has_heading
        segment.save!
        create_annotations(row, interview, segment)
      else
        segment = row[:segment]
        interview.project.available_locales.map{|l| ISO_639.find(l).alpha3}.each do |locale|
          segment.update!(
            mainheading: row["mainheading_#{locale}".to_sym],
            subheading: row["subheading_#{locale}".to_sym],
            locale: locale,
            has_heading: true
          ) if row["mainheading_#{locale}".to_sym] || row["subheading_#{locale}".to_sym]
        end
      end
      create_references(row, interview, segment)
    end
  end

  # Checks timestamps and resolves references-only rows within this interview.
  # @return [void]
  # @raise [Timecode::ImportFormatError] If any row is invalid or ambiguous
  def validate_rows!
    errors = []
    errors << 'The edit table has no rows. Add at least one row and upload it again.' if sheet.empty?
    previous = {}
    sheet.each_with_index do |row, index|
      location = "Row #{index + 2}, tape #{row[:tape_number].inspect}"
      raw = row[:timecode]
      begin
        row[:timecode] = Timecode.parse_import(raw.is_a?(String) ? raw.strip : raw)
      rescue Timecode::ImportFormatError => e
        errors << "#{location}: timecode #{raw.to_s.truncate(100).inspect}. #{e.message}"
        next
      end
      number = row[:tape_number].to_s
      unless /\A[1-9][0-9]*\z/.match?(number)
        errors << "#{location}: Use a positive whole tape number."
        next
      end
      timecode = row[:timecode]
      # Compare by length first, then by digits, which handles hours above 99.
      if previous[number] && ([timecode.length, timecode] <=> [previous[number].length, previous[number]]).negative?
        errors << "#{location}: Timecode #{timecode} cannot be earlier than #{previous[number]}."
      end
      previous[number] = timecode
      next unless only_references

      # Handle references-only rows by finding the unique segment for this tape, timecode, and speaker designation.
      tape = interview.tapes.find_by(number: number)
      matches = tape ? tape.segments.where(timecode: timecode).to_a : []
      if matches.size > 1
        speaker_id = contributions.key(row[:speaker_designation])
        matches = speaker_id ? matches.select { |segment| segment.speaker_id == speaker_id } : []
      end
      if matches.one?
        row[:segment] = matches.first
      else
        errors << "#{location}: Timecode #{timecode} must identify one existing segment. Check the tape, timecode, and speaker designation."
      end
    end
    raise Timecode::ImportFormatError, errors.join("\n") if errors.any?
  end

  def create_references(row, interview, ref_object)
    row[:registry_references] && row[:registry_references].split('#').each do |registry_entry_id|
      registry_entry = interview.project.registry_entries.find_by(id: registry_entry_id)
      if registry_entry
        RegistryReference.create!(
          registry_entry_id: registry_entry_id,
          ref_object_id: ref_object.id,
          ref_object_type: ref_object.class.name,
          ref_position: 0,
          original_descriptor: "",
          ref_details: "",
          ref_comments: "",
          ref_info: "",
          workflow_state: "checked",
          interview_id: interview.id
        )
        registry_entry && registry_entry.touch
      end
    end
  end

  def create_annotations(row, interview, segment)
    annotations_with_translations = {}
    interview.annotation_alpha3s.map do |alpha3|
      annotations_with_translations[alpha3] = row["annotation_#{alpha3}".to_sym]&.split('#')
    end

    original = annotations_with_translations[interview.alpha3]
    if original
      while original&.length > 0
        translations_attributes = []
        interview.annotation_alpha3s.each do |alpha3|
          translations_attributes << {
            text: annotations_with_translations[alpha3]&.pop,
            locale: alpha3
          }
        end

        Annotation.create!(
          segment_id: segment.id,
          interview_id: interview.id,
          workflow_state: "public",
          translations_attributes: translations_attributes
        )
      end
    end
  end
end
