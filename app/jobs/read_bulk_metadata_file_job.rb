class ReadBulkMetadataFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver, project, locale)
    jobs_logger.info "*** uploading #{file_path} metadata"
    read_file(file_path, project, locale)

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_metadata.processed',
      #file: File.basename(file_path),
    #)

    jobs_logger.info "*** uploaded #{file_path} metadata"
    AdminMailer.with(receiver: receiver, type: 'read_campscape', file: file_path).finished_job.deliver_now
    File.delete(file_path) if File.exist?(file_path)
  end

  def read_file(file_path, project, locale)
    I18n.locale = locale

    csv_options = { col_sep: ";", row_sep: :auto, quote_char: "\x00" }
    csv = Roo::Spreadsheet.open(file_path, { csv_options: csv_options })
    if csv.first.length == 1
      csv_options.update(col_sep: "\t")
      csv = Roo::Spreadsheet.open(file_path, { csv_options: csv_options })
    end

    sheet = csv.sheet('default').parse(MetadataImportTemplate.columns_hash(locale))
    sheet.each_with_index do |row, index|

      interview = update_or_create_interview(project, row)

      create_default_tape(interview) unless interview.tapes.any?

      update_or_create_interviewee(project, row)

      create_contributions(interview, row[:interviewer], 'interviewer')
      create_contributions(interview, row[:transcriptor], 'transcriptor')
      create_contributions(interview, row[:translator], 'translator')
      create_contributions(interview, row[:research], 'research')
            
      project.registry_reference_type_import_metadata_fields.each do |field|
        registry_entry = find_or_create_registry_entry(field, row, locale)
        ref_object = field.ref_object_type == 'Interview' ? interview : interviewee
        create_reference(registry_entry.id, interview, ref_object, field.registry_reference_type_id)
      end

      interview.touch
    end
    File.delete(file_path) if File.exist?(file_path)
  rescue StandardError => e
    log("*** #{project.shortname} - #{project.id}")
    log("#{e.message}: #{e.backtrace}")
  end

  def report
    @report ||= ''
  end

  def update_or_create_interview(project, row)
    interview_data = {
      project_id: project.id,
      archive_id: row[:archive_id],
      signature_original: row[:signature_original],
      language_id: (language = find_or_create_language(row[:language_id]); language ? language.id : nil),
      collection_id: row[:collection_id] && find_or_create_collection(row[:collection_id], project).id,
      interview_date: row[:interview_date],
      media_type: row[:media_type] && row[:media_type].downcase,
      duration: row[:duration],
      observations: row[:observations],
      description: row[:description],
    }

    # TODO: fit to campscape specifications again
    #properties = {interviewer: data[23], link: data[27], subcollection: data[13]}.select{|k,v| v != nil}

    interview = Interview.find_by_archive_id(row[:archive_id]) ||
      (row[:signature_original] && Interview.find_by_signature_original(row[:signature_original]))

    if interview
      #interview_properties = interview.properties.update(properties)
      interview.update_attributes interview_data.select{|k,v| v != nil}#.update(properties: interview_properties)
    else
      interview = Interview.create interview_data#.update(properties: properties)
    end
    interview
  end

  def create_default_tape(interview)
    Tape.find_or_create_by interview_id: interview.id, media_id: "#{interview.archive_id.upcase}_01_01", workflow_state: "digitized", time_shift: 0, number: 1 
  end

  def update_or_create_interviewee(project, row)
    interviewee_data = {
      project_id: project.id,
      first_name: row[:first_name],
      last_name: row[:last_name],
      birth_name: row[:birth_name],
      alias_names: row[:alias_names],
      other_first_names: row[:other_first_names],
      gender: gender(row[:gender]),
      date_of_birth: row[:date_of_birth],
      biography: row[:biography],
    }.select{|k,v| v != nil}

    if interview.interviewee
      interview.interviewee.update_attributes interviewee_data
    else
      interviewee = Person.find_or_create_by interviewee_data
      Contribution.create person_id: interviewee.id, interview_id: interview.id, contribution_type_id: project.contribution_types.find_by_code('interviewee').id
    end
  end

  def gender(name)
    if name
      case name.downcase
      when 'm', 'male', 'man', 'männlich', 'mann'
        'male'
      when 'f', 'female', 'w', 'woman', 'weiblich', 'frau'
        'female'
      else
        'diverse'
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

  def find_or_create_language(name)
    if name
      languages = name.split(/\s+[ua]nd\s+/).map do |l| 
        # ISO_639 knows only english  and french
        ISO_639.find(l) ||
        ISO_639.find(l[0..2].downcase) || # some german language names can be found like this 
        ISO_639.find_by_english_name(l.classify) ||
        ISO_639.search(l).first 
      end.compact.uniq
      code = languages.map(&:alpha3).join('/')
      english_name = languages.map(&:english_name).join(' and ')
      language = Language.find_by_code(code)
      language = Language.create(code: code, name: english_name) if (!language && !code.blank?)
      language
    end
  end

  def create_contributions(interview, contributors_string, contribution_type)
    contributors_string && contributors_string.gsub('"', '').split(/#\s*/).each do |contributor_string|
      last_name, first_name = contributor_string.split(/,\s*/)
      contributor = Person.find_or_create_by first_name: first_name, last_name: last_name, project_id: interview.project.id
      Contribution.create person_id: contributor.id, interview_id: interview.id, contribution_type_id: interview.project.contribution_types.find_by_code(contribution_type).id
    end
  end

  def find_or_create_registry_entry(field, row, locale)
    col_key = "rrt_#{field.registry_reference_type_id}"
    sub_category_col_key = "rrt_sub_#{field.registry_reference_type_id}"

    registry_entry = field.registry_entry.find_descendant_by_name(row[col_key], locale)
    unless registry_entry
      sub_category_registry_entry = field.registry_entry.find_descendant_by_name(row[sub_category_col_key], locale) ||
        field.registry_entry.create_child(row[sub_category_col_key], locale)
      registry_entry = (sub_category_registry_entry || field.registry_entry).create_child(row[col_key], locale)
    end
    registry_entry
  end

  def create_reference(registry_entry, interview, ref_object, ref_type_id=nil)
    RegistryReference.create registry_entry_id: registry_entry.id, ref_object_id: ref_object.id, ref_object_type:ref_object.class.name, registry_reference_type_id: ref_type_id, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: interview.id
  end

  #def destroy_reference(ref_object, ref_type_id=nil, parent_registry_entry_code=nil)
    #if ref_type_id
      #ref_object.registry_references.where(registry_reference_type_id: ref_type_id).destroy_all
    #else
      #parent = RegistryEntry.find_by_code parent_registry_entry_code
      #ref_object.registry_references.each do |rr|
        #rr.destroy if rr.registry_entry.parent_ids.include?(parent.id)
      #end
    #end
  #end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'metadata_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end
end
