class ReadBulkMetadataFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver)
    read_file(file_path)
    File.delete(file_path) if File.exist?(file_path)
    AdminMailer.with(receiver: receiver, type: 'read_campscape', file: file_path).finished_job.deliver_now
  end

  def read_file(file_path)
    I18n.locale = :en
    report << ""
    report << "Import Report for file #{file_path.split('/').last}:"

    content = File.readlines file_path
    content[4..(content.length - 1)].each do |line|
      data = line.split(';') rescue []
      unless data[1].blank?

        report << ""
        report << "  Interview from line #{line}:"

        interviewee = Person.where(first_name: data[1], birth_name: data[2], last_name: data[3], other_first_names: data[4], gender: gender(data[5]), date_of_birth: data[6] || data[7]).first
        if interviewee
          report << "    Used existing Person #{interviewee.id}, #{interviewee.name[:en]} as interviewee."
        else
          interviewee = Person.create first_name: data[1][0..200], birth_name: data[2][0..200], last_name: data[3][0..200], other_first_names: data[4][0..200], gender: gender(data[5]), date_of_birth: data[6] || data[7]
          report << "    Created Person #{interviewee.id}, #{interviewee.name[:en]} as interviewee."
        end

        short_bio = interviewee.biographical_entries.where(text: data[11]).first
        interviewee.biographical_entries << BiographicalEntry.create(text: data[11]) unless short_bio || data[11].blank?

        interview_date = Date.parse(data[17]) rescue nil
        if interview_date
          interview_date = interview_date.strftime("%d.%m.%Y")
          interview = interviewee.interviews.where(interview_date: interview_date).first 
        else
          interview = interviewee.interviews.first 
        end

        interview_data = {
          interview_date: interview_date,
          collection_id: find_or_create_collection(data[12]).id,
          language_id: (language = find_or_create_language(data[16]); language ? language.id : nil),
          duration: data[22],
          video: data[15].downcase == 'video',
          archive_id: archive_id
        }

        if interview
          interview.update_attributes interview_data
          report << "    Updated existing interview #{interview.id}."
        else
          interview = Interview.create interview_data
          report << "    Created interview #{interview.id}."
        end

        Contribution.find_or_create_by person_id: interviewee.id, interview_id: interview.id, contribution_type: Project.contribution_types['interviewee']

        group = find_or_create_group(data[8])
        create_reference(group.id, interview) if group

        birth_location_type = RegistryReferenceType.find_by_code('birth_location')
        place = find_or_create_place(data[9], data[10])
        create_reference(place.id, interview, birth_location_type.id) if place
      end
    end
  end

  def report
    @report ||= ''
  end

  def gender(name)
    %w(m male man männlich mann).include?(name.downcase) ? 'male' : 'female'
  end
   
  def archive_id
    number = Interview.last ? (Interview.last.id + 1) : 1
    "new#{format("%04d", number)}"
  end

  def find_or_create_collection(name)
    collection = nil
    Collection.all.each do |c| 
      collection = c if c.translations.map(&:name).include?(name)
    end

    if collection
      report << "    Added to collection #{collection.localized_hash[:en]}."
    else
      collection = Collection.create(name: name[0..200])
      report << "    Created collection #{collection.localized_hash[:en]} and added interview to it."
    end
    collection
  end

  def find_or_create_language(name)
    lang = ISO_639.find(name)
    lang = ISO_639.find_by_english_name(name) unless lang
    if lang
      language = Language.find_by_code(lang.alpha3) 
      language = Language.create(code: lang.alpha3, name: lang.english_name) unless language
    end
    if language
      report << "    Used #{language.code}." 
    else
      report << "    No Language for #{name}." 
    end
    language
  end

  def find_or_create_group(name)
    group = nil
    forced_labor_groups = RegistryEntry.find_by_entry_code('forced_labor_groups')
    
    # the following group_names contain only the first registry_name of a registry_entry with all it s translations!!
    forced_labor_groups.children.each do |c| 
      group = c if c.registry_names.first.translations.map(&:descriptor).include?(name)
    end

    if group
      report << "    Added to group #{group.localized_hash[:en]}."
    else
      group = RegistryEntry.create_with_parent_and_name(forced_labor_groups.id, name[0..200]) 
      report << "    Created group #{group.localized_hash[:en]} and added interview to it."
    end
    group
  end

  def find_or_create_place(name, country_name)
    place = nil
    country = nil

    places = RegistryEntry.find_by_entry_code('places')
    
    # find or create country registry_entry as a child of places
    places.children.each do |c| 
      country = c if c.registry_names.first.translations.map(&:descriptor).include?(country_name)
    end

    if country
      report << "    Added to country #{country.localized_hash[:en]}."
    else
      country = RegistryEntry.create_with_parent_and_name(places.id, country_name[0..200]) 
      report << "    Created country #{country.localized_hash[:en]} and added interview to it."
    end

    # find or create place registry_entry as a child of country
    country.descendants.each do |c| 
      place = c if c.registry_names.first.translations.map(&:descriptor).include?(name)
    end

    if place
      report << "    Added to place #{place.localized_hash[:en]}."
    else
      place = RegistryEntry.create_with_parent_and_name(country.id, name[0..200]) 
      report << "    Created place #{place.localized_hash[:en]} and added interview to it."
    end
    place
  end

  def create_reference(registry_entry_id, interview, type_id=nil)
    RegistryReference.create registry_entry_id: registry_entry_id, ref_object_id: interview.id, ref_object_type: "Interview", registry_reference_type_id: type_id, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: interview.id
  end

end
