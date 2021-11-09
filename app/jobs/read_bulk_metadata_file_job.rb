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
    csv = Roo::CSV.new(file_path, csv_options: csv_options)
    if csv.first.length == 1
      csv_options.update(col_sep: "\t")
      csv = Roo::CSV.new(file_path, csv_options: csv_options)
    end

    csv.each_with_index do |data, index|
      unless index == 0
        begin
          unless data[0].blank? && data[1].blank? && data[2].blank?
            interview = Interview.find_by_archive_id(data[0]) || (data[14] && Interview.find_by_signature_original(data[14]))

            interview_data = {
              project_id: project.id,
              interview_date: data[17] || data[18],
              collection_id: data[12] && find_or_create_collection(data[12]).id,
              language_id: (language = find_or_create_language(data[16]); language ? language.id : nil),
              duration: data[21],
              media_type: data[15] && data[15].downcase,
              archive_id: data[0],
              signature_original: data[14], 
            }

            properties = {interviewer: data[23], link: data[27], subcollection: data[13]}.select{|k,v| v != nil}

            if interview
              interview_properties = interview.properties.update(properties)
              interview.update_attributes interview_data.select{|k,v| v != nil}.update(properties: interview_properties)
            else
              interview = Interview.create interview_data.update(properties: properties)
            end

            # create default tape 
            Tape.find_or_create_by interview_id: interview.id, media_id: "#{interview.archive_id.upcase}_01_01", workflow_state: "digitized", time_shift: 0, number: 1 

            interviewee_data = {
              first_name: data[1],
              last_name: data[2],
              alias_names: data[3],
              gender: gender(data[4]),
              date_of_birth: data[5] || data[6],
              project_id: project.id
            }.select{|k,v| v != nil}

            if interview.interviewee
              interview.interviewee.update_attributes interviewee_data
            else
              interviewee = Person.find_or_create_by interviewee_data
              Contribution.create person_id: interviewee.id, interview_id: interview.id, contribution_type_id: project.contribution_types.find_by_code('interviewee').id
            end

            short_bio = BiographicalEntry.find_or_create_by(person_id: interview.interviewee.id)
            short_bio.update_attributes text: data[11]

            create_contributions(interview, data[23], 'interviewer')
            create_contributions(interview, data[24], 'transcriptor')
            create_contributions(interview, data[25], 'translator')
            create_contributions(interview, data[26], 'research')
            
            reference(interview, data[22], 'accessibility')
            reference(interview, data[28], 'camp')
            reference(interview, data[7], 'group')
            reference(interview, data[8], 'group_detail')

            # create birth location and reference it
            if data[9] || data[10]
              birth_location_type = project.registry_reference_types.find_by_code('birth_location')
              place = find_or_create_place(data[9], data[10])
              destroy_reference(interview, birth_location_type.id)
              create_reference(place.id, interview, interview.interviewee, birth_location_type.id) if place
            end

            # create interview location and reference it
            if data[19] || data[20]
              interview_location_type = project.registry_reference_types.find_by_code('interview_location')
              place = find_or_create_place(data[19], data[20])
              destroy_reference(interview, interview_location_type.id)
              create_reference(place.id, interview, interview, interview_location_type.id) if place
            end
            interview.touch
          end
          File.delete(file_path) if File.exist?(file_path)
        rescue StandardError => e
          log("#{e.message}: #{e.backtrace}")
        end
      end
    end
  end

  def report
    @report ||= ''
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
   
  def archive_id
    number = Interview.last ? (Interview.maximum(:archive_id)[/\d+/].to_i + 1) : 1
    "new#{format("%04d", number)}"
  end

  def find_or_create_collection(name)
    collection = nil
    Collection.all.each do |c| 
      collection = c if c.translations.map(&:name).include?(name)
    end

    if collection
    else
      collection = Collection.create(name: name[0..200])
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

  def find_or_create_place(name, country_name)
    country = country_name && RegistryEntry.find_or_create_descendant('places', "#{I18n.locale}::#{country_name}")
    place = name && RegistryEntry.find_or_create_descendant(country ? country.code : 'places', "#{I18n.locale}::#{name}")
    place
  end

  def create_contributions(interview, contributors_string, contribution_type)
    contributors_string && contributors_string.gsub('"', '').split(/#\s*/).each do |contributor_string|
      last_name, first_name = contributor_string.split(/,\s*/)
      contributor = Person.find_or_create_by first_name: first_name, last_name: last_name, project_id: interview.project.id
      Contribution.create person_id: contributor.id, interview_id: interview.id, contribution_type_id: interview.project.contribution_types.find_by_code(contribution_type).id
    end
  end

  def reference(interview, data, code)
    if data
      registry_reference_type = interview.project.registry_reference_types.find_by_code(code)
      registry_entry = data && RegistryEntry.find_or_create_descendant(code, "#{I18n.locale}::#{data}")
      destroy_reference(interview, registry_reference_type && registry_reference_type.id, code)
      create_reference(registry_entry.id, interview, interview, registry_reference_type && registry_reference_type.id) if registry_entry
    end
  end

  def create_reference(registry_entry_id, interview, ref_object, ref_type_id=nil)
    rr = RegistryReference.create registry_entry_id: registry_entry_id, ref_object_id: ref_object.id, ref_object_type:ref_object.class.name, registry_reference_type_id: ref_type_id, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: interview.id
    rr
  end

  def destroy_reference(ref_object, ref_type_id=nil, parent_registry_entry_code=nil)
    if ref_type_id
      ref_object.registry_references.where(registry_reference_type_id: ref_type_id).destroy_all
    else
      parent = RegistryEntry.find_by_code parent_registry_entry_code
      ref_object.registry_references.each do |rr|
        rr.destroy if rr.registry_entry.parent_ids.include?(parent.id)
      end
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'metadata_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end
end
