class ReadBulkMetadataFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver)
    read_file(file_path)
    Interview.reindex
    Rails.cache.redis.keys("#{Project.current.cache_key_prefix}-*").each{|k| Rails.cache.delete(k)}

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_metadata.processed',
      #file: File.basename(file_path),
    #)

    AdminMailer.with(receiver: receiver, type: 'read_campscape', file: file_path).finished_job.deliver_now
  end

  def read_file(file_path)
    I18n.locale = :en

    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00" })
    csv.each_with_index do |data, index|
      unless index == 0
        begin
          unless data[0].blank? && data[1].blank? && data[2].blank?
            interviewee = find_or_create_person(first_name: data[1], last_name: data[2], alias_names: data[3], gender: gender(data[4]), date_of_birth: data[5] || data[6])

            #interviewer_names = data[18] && data[18].split(/[ ,]/).reject(&:blank?)
            #interviewer = find_or_create_person(first_name: interviewer_names[0], last_name: interviewer_names[1]) if interviewer_names

            short_bio = interviewee.biographical_entries.where(text: data[11]).first
            interviewee.biographical_entries << BiographicalEntry.create(text: data[11]) unless short_bio || data[11].blank?

            interview = Interview.find_by_archive_id(data[0])

            interview_data = {
              interview_date: data[17] || data[18],
              collection_id: data[12] && find_or_create_collection(data[12]).id,
              language_id: (language = find_or_create_language(data[16]); language ? language.id : nil),
              duration: data[21],
              media_type: data[15],
              archive_id: data[0],
              properties: {interviewer: data[23], signature_original: data[14], link: data[27], subcollection: data[13]}
            }

            if interview
              interview.update_attributes interview_data
            else
              interview = Interview.create interview_data
            end

            # cleanup missleading contributions
            Contribution.where(interview_id: interview.id, contribution_type: 'interviewee').destroy_all
            Contribution.create person_id: interviewee.id, interview_id: interview.id, contribution_type: 'interviewee'

            # create accesibility and reference it
            accessibility = data[22] && RegistryEntry.find_or_create_descendant('accessibility', "#{I18n.locale}::#{data[22]}")
            create_reference(accessibility.id, interview, interview) if accessibility

            # create camp and reference it
            camp = data[28] && RegistryEntry.find_or_create_descendant('camps', "#{I18n.locale}::#{data[28]}")
            create_reference(camp.id, interview, interview) if camp

            # create group and reference it
            group = data[7] && RegistryEntry.find_or_create_descendant('groups', "#{I18n.locale}::#{data[7]}")
            create_reference(group.id, interview, interview) if group

            # create group_details and reference it
            group_details = data[8] && RegistryEntry.find_or_create_descendant('group_details', "#{I18n.locale}::#{data[8]}")
            create_reference(group.id, interview, interview) if group_details

            # create birth location and reference it
            birth_location_type = RegistryReferenceType.find_by_code('birth_location')
            place = find_or_create_place(data[9], data[10])
            create_reference(place.id, interview, interviewee, birth_location_type.id) if place

            # create interview location and reference it
            interview_location_type = RegistryReferenceType.find_by_code('interview_location')
            place = find_or_create_place(data[19], data[20])
            create_reference(place.id, interview, interview, interview_location_type.id) if place
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
      %w(m male man männlich mann).include?(name.downcase) ? 'male' : 'female'
    end
  end
   
  def archive_id
    number = Interview.last ? (Interview.maximum(:archive_id)[/\d+/].to_i + 1) : 1
    "new#{format("%04d", number)}"
  end

  def find_or_create_person(opts)
    person = Person.where(opts).first 
    person ? person.update_attributes(opts) : Person.create(opts)
    person
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
    languages = name.split(' and ').map do |l| 
      ISO_639.find(l) ||
      ISO_639.find_by_english_name(l.classify) ||
      ISO_639.search(l).first 
    end
    code = languages.map(&:alpha3).join('/')
    english_name = languages.map(&:english_name).join(' and ')
    language = Language.find_by_code(code)
    language = Language.create(code: code, name: english_name) unless language
    language
  end

  def find_or_create_place(name, country_name)
    country = country_name && RegistryEntry.find_or_create_descendant('places', "#{I18n.locale}::#{country_name}")
    place = name && RegistryEntry.find_or_create_descendant(country ? country.code : 'places', "#{I18n.locale}::#{name}")
    place
  end

  def create_reference(registry_entry_id, interview, ref_object, ref_type_id=nil)
    rr = RegistryReference.create registry_entry_id: registry_entry_id, ref_object_id: ref_object.id, ref_object_type:ref_object.class.name, registry_reference_type_id: ref_type_id, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: interview.id
    rr
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'metadata_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end
end
