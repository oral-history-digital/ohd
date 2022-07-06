class EditTableImport

  attr_accessor :file_path, :sheet, :interview, :contributions, :original_locale, :translation_locale

  def initialize(public_interview_id, file_path)
    @interview = Interview.find_by_archive_id(public_interview_id)
    @contributions = @interview.contributions.inject({}) do |mem, c|
      mem[c.person_id] = c.speaker_designation
      mem
    end
    @original_locale = @interview.lang
    @translation_locale = (@interview.languages - [@interview.lang]).first ||
      (@interview.project.available_locales - [@interview.lang]).first
    @file_path = file_path
    @sheet = parse_sheet
  end

  def parse_sheet
    csv_options = { col_sep: "\t", row_sep: :auto, quote_char: "\x00" }
    csv = Roo::Spreadsheet.open(file_path, { csv_options: csv_options })
    if csv.first.length == 1
      csv_options.update(col_sep: ";")
      csv = Roo::Spreadsheet.open(file_path, { csv_options: csv_options })
    end

    interview.tapes.destroy_all
    interview.find_or_create_tapes(csv.cell(csv.last_row, 1).to_i)

    csv.sheet('default').parse({
      tape_number: 'Band',
      timecode: 'Timecode',
      speaker_designation: 'Sprecher',
      text_orig: 'Transkript',
      text_trans: 'Übersetzung',
      mainheading_orig: 'Hauptüberschrift',
      subheading_orig: 'Zwischenüberschrift',
      mainheading_trans: 'Hauptüberschrift (Übersetzung)',
      subheading_trans: 'Zwischenüberschrift (Übersetzung)',
      registry_references: 'Registerverknüpfungen',
      annotations: 'Anmerkungen'
    })
  end

  def process
    sheet.each do |row|
      unless interview.tapes.where(number: row[:tape_number]).first
        binding.pry
      end

      segment = Segment.create(
        interview_id: interview.id,
        tape_id: interview.tapes.where(number: row[:tape_number]).first.id,
        timecode: row[:timecode],
        translations_attributes: [
          {
            locale: original_locale,
            text: row[:text_orig],
            mainheading: row[:mainheading_orig],
            subheading: row[:subheading_orig],
          },
          {
            locale: translation_locale,
            text: row[:text_trans],
            mainheading: row[:mainheading_trans],
            subheading: row[:subheading_trans],
          }
        ]
      )
      registry_entries = find_or_create_registry_entries(row).compact.uniq
      create_references(registry_entries, interview, segment)
      create_annotations(row, interview, segment)
    end
  rescue StandardError => e
    log("*** #{interview.archive_id}: ")
    log("#{e.message}: #{e.backtrace}")
  end

  def find_or_create_registry_entries(row)
    (row[:registry_references] && row[:registry_references].split('#') || []).inject([]) do |mem, name|
      registry_entry = interview.project.registry_entries.joins(registry_names: :translations).
        where("registry_name_translations.descriptor": name).first
      registry_entry ||= interview.project.root_registry_entry.create_child(name, :de)
      mem << registry_entry
    end
  end

  def create_references(registry_entries, interview, ref_object)
    registry_entries.each do |registry_entry|
      RegistryReference.create(
        registry_entry_id: registry_entry.id,
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
      registry_entry.touch
    end
  end

  def create_annotations(row, interview, segment)
    row[:annotations] && row[:annotations].split('#').each do |text|
      unless text.blank?
        Annotation.create(
          segment_id: segment.id,
          interview_id: interview.id,
          workflow_state: "public",
          text: text,
          locale: :de
          #author_id: 
          #author:
        )
      end
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'edit_table_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end
end
