class MetadataImport

  attr_accessor :file_path, :project, :locale, :sheet

  def initialize(file_path, project, locale)
    I18n.locale = locale
    @file_path = file_path
    @project = project
    @locale = locale
    @sheet = parse_sheet
  end

  def parse_sheet
    csv_options = { col_sep: ";", row_sep: :auto, quote_char: "\x00" }
    csv = Roo::Spreadsheet.open(file_path, { csv_options: csv_options })
    if csv.first.length == 1
      csv_options.update(col_sep: "\t")
      csv = Roo::Spreadsheet.open(file_path, { csv_options: csv_options })
    end
    csv.sheet('default').parse(MetadataImportTemplate.new(project, locale).columns_hash)
  end

  def process
    sheet.each do |row|

      interview = update_or_create_interview(project, row)

      interview.find_or_create_tapes(row[:tape_count])

      update_or_create_interviewee(project, interview, row)

      project.contribution_types.each do |contribution_type|
        if contribution_type.use_in_export# && contribution_type.code != 'interviewee'
          create_contributions(interview, row[contribution_type.code.to_sym], contribution_type.code)
        end
      end

      project.registry_reference_type_import_metadata_fields.each do |field|
        registry_entries = find_or_create_registry_entries(field, row, locale)
        if !registry_entries.empty?
          ref_object = field.ref_object_type == 'Interview' ? interview : interview.interviewee
          destroy_references(ref_object, field.registry_reference_type_id, interview)
          create_references(registry_entries, interview, ref_object, field.registry_reference_type_id)
        end
      end

      interview.touch
    end
  rescue StandardError => e
    log("*** #{project.shortname} - #{project.id}")
    log("#{e.message}: #{e.backtrace}")
  end

  def update_or_create_interview(project, row)
    interview_data = {
      project_id: project.id,
      archive_id: row[:archive_id],
      signature_original: row[:signature_original],
      collection_id: row[:collection_id] && find_or_create_collection(row[:collection_id], project).id,
      interview_date: row[:interview_date],
      media_type: row[:media_type] && row[:media_type].downcase,
      duration: row[:duration],
      observations: row[:observations],
      description: row[:description],
    }

    interview_languages_attributes = [
      {
        language: find_language(row[:primary_language_id]),
        spec: 'primary'
      },
      {
        language: find_language(row[:primary_translation_language_id]),
        spec: 'primary_translation'
      },
    ]

    secondary_language = find_language(row[:secondary_language_id])
    interview_languages_attributes << {
      language: secondary_language,
      spec: 'secondary'
    } if secondary_language

    interview_data[:interview_languages_attributes] = interview_languages_attributes

    # TODO: fit to campscape specifications again
    #properties = {interviewer: data[23], link: data[27], subcollection: data[13]}.select{|k,v| v != nil}
    properties = {link: row[:link_to_interview]}.select{|k,v| v != nil}

    interview = Interview.find_by_archive_id(row[:archive_id]) ||
      (row[:signature_original] && Interview.find_by_signature_original(row[:signature_original]))

    if interview
      interview_properties = interview.properties.update(properties)
      interview.update interview_data.select{|k,v| v != nil}.update(properties: interview_properties)
    else
      interview = Interview.create interview_data.update(properties: properties)
    end
    interview.public_attributes=({signature_original: true}) if row[:signature_original]
    interview.save
    interview
  end

  def create_default_tape(interview)
    Tape.find_or_create_by interview_id: interview.id, media_id: "#{interview.archive_id.upcase}_01_01", workflow_state: "digitized", time_shift: 0, number: 1 
  end

  def update_or_create_interviewee(project, interview, row)
    interviewee_data = {
      project_id: project.id,
      first_name: row[:first_name],
      last_name: row[:last_name],
      birth_name: row[:birth_name],
      alias_names: row[:alias_names],
      other_first_names: row[:other_first_names],
      pseudonym_first_name: row[:pseudonym_first_name],
      pseudonym_last_name: row[:pseudonym_last_name],
      use_pseudonym: %w(yes y ja j true t).include?(row[:use_pseudonym]) ? true : false,
      description: row[:person_description],
      gender: gender(row[:gender]),
      date_of_birth: row[:date_of_birth],
      biography: {text: row[:biography], workflow_state: %w(yes y ja j true t).include?(row[:biography_public]) ? 'public' : 'unshared'},
    }.select{|k,v| v != nil}

    if interview.interviewee
      interview.interviewee.update interviewee_data
    else
      interviewee = Person.find_or_create_by project_id: project.id, first_name: row[:first_name], last_name: row[:last_name]
      interviewee.update interviewee_data
      Contribution.create(
        person_id: interviewee.id,
        interview_id: interview.id,
        contribution_type_id: project.contribution_types.find_by_code('interviewee').id,
        workflow_state: 'public'
      )
    end
  end

  def gender(name)
    if name
      case name.downcase
      when 'm', 'male', 'man', 'männlich', 'mann'
        'male'
      when 'f', 'female', 'w', 'woman', 'weiblich', 'frau'
        'female'
      when 'd', 'diverse', 'divers'
        'diverse'
      else
        'not_specified'
      end
    end
  end
   
  def find_or_create_collection(name, project)
    collection = nil
    Collection.where(project_id: project.id).each do |c| 
      collection = c if c.translations.map(&:name).include?(name)
    end

    unless collection
      collection = Collection.create(name: name[0..200], project_id: project.id)
    end
    collection
  end

  def find_language(name)
    Language.find_by_code_or_name(name) || Language.find_with_iso_code(name)
  end

  def create_contributions(interview, contributors_string, contribution_type)
    contributors_string && contributors_string.split(/#\s*/).each do |contributor_string|
      contributor_string.sub(/\"/, '') if contributor_string.count("\"") == 1
      last_name, first_name = contributor_string.split(/,\s*/)
      contributor = Person.find_or_create_by first_name: first_name, last_name: last_name, project_id: interview.project.id
      Contribution.create(
        person_id: contributor.id,
        interview_id: interview.id,
        contribution_type_id: interview.project.contribution_types.find_by_code(contribution_type).id,
        workflow_state: 'public'
      )
    end
  end

  def find_or_create_registry_entries(field, row, locale)
    col_key = "rrt_#{field.registry_reference_type_id}".to_sym
    sub_category_col_key = "rrt_sub_#{field.registry_reference_type_id}".to_sym

    field_rrt_re = field.registry_reference_type.registry_entry
    sub_category_registry_entry = field_rrt_re.find_descendant_by_name(row[sub_category_col_key], locale) ||
      (row[sub_category_col_key] && field_rrt_re.create_child(row[sub_category_col_key], locale))

    registry_entries = row[col_key] && row[col_key].split('#').map do |name|
      name.sub(/\"/, '') if name.count("\"") == 1
      field_rrt_re.find_descendant_by_name(name, locale) || 
        (sub_category_registry_entry || field_rrt_re).create_child(name, locale)
    end || []

    (registry_entries.empty? ? [sub_category_registry_entry] : registry_entries).compact.uniq
  end

  def create_references(registry_entries, interview, ref_object, ref_type_id=nil)
    registry_entries.each do |registry_entry|
      RegistryReference.create(
        registry_entry_id: registry_entry.id,
        ref_object_id: ref_object.id,
        ref_object_type:ref_object.class.name,
        registry_reference_type_id: ref_type_id,
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

  def destroy_references(ref_object, ref_type_id, interview)
    if ref_type_id
      ref_object.registry_references.where(registry_reference_type_id: ref_type_id, interview_id: interview.id).destroy_all
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'metadata_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end
end
