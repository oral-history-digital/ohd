class ReadBulkMetadataFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver)
    read_file(file_path)
    Interview.reindex
    Rails.cache.redis.keys("#{Project.cache_key_prefix}-*").each{|k| Rails.cache.delete(k)}

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
            interviewee = find_or_create_person(first_name: data[1], birth_name: data[2], last_name: data[3], other_first_names: data[4], gender: gender(data[5]), date_of_birth: data[6] || data[7])

            #interviewer_names = data[18] && data[18].split(/[ ,]/).reject(&:blank?)
            #interviewer = find_or_create_person(first_name: interviewer_names[0], last_name: interviewer_names[1]) if interviewer_names

            short_bio = interviewee.biographical_entries.where(text: data[12]).first
            interviewee.biographical_entries << BiographicalEntry.create(text: data[12]) unless short_bio || data[12].blank?

            interview = Interview.find_by_archive_id(data[0])

            interview_data = {
              interview_date: data[18] || data[19],
              collection_id: data[13] && find_or_create_collection(data[13]).id,
              language_id: (language = find_or_create_language(data[17]); language ? language.id : nil),
              duration: data[23],
              video: data[16] && data[16].downcase == 'video',
              archive_id: data[0],
              properties: {interviewer: data[25], signature_original: data[15], link: data[31]}
            }

            if interview
              interview.update_attributes interview_data
            else
              interview = Interview.create interview_data
            end

            binding.pry
            Contribution.find_or_create_by person_id: interviewee.id, interview_id: interview.id, contribution_type: 'interviewee'

            # create accesibility and reference it
            accessibility = data[24] && RegistryEntry.find_or_create_descendant('accessibility', "#{I18n.locale}::#{data[24]}")
            create_reference(accessibility.id, interview, interview) if accessibility

            # create camp and reference it
            camp = data[32] && RegistryEntry.find_or_create_descendant('camps', "#{I18n.locale}::#{data[32]}")
            create_reference(camp.id, interview, interview) if camp

            # create group and reference it
            group = data[8] && RegistryEntry.find_or_create_descendant('groups', "#{I18n.locale}::#{data[8]}")
            create_reference(group.id, interview, interview) if group

            # create group_details and reference it
            group_details = data[9] && RegistryEntry.find_or_create_descendant('group_details', "#{I18n.locale}::#{data[9]}")
            create_reference(group.id, interview, interview) if group_details

            # create birth location and reference it
            birth_location_type = RegistryReferenceType.find_by_code('birth_location')
            place = find_or_create_place(data[10], data[11])
            create_reference(place.id, interview, interviewee, birth_location_type.id) if place

            # create interview location and reference it
            interview_location_type = RegistryReferenceType.find_by_code('interview_location')
            place = find_or_create_place(data[20], data[21])
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
    Person.where(opts).first || Person.create(opts)
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
    lang = ISO_639.find(name)
    lang = ISO_639.find_by_english_name(name) unless lang
    if lang
      language = Language.find_by_code(lang.alpha3) 
      language = Language.create(code: lang.alpha3, name: lang.english_name) unless language
    end
    if language
    else
    end
    language
  end

  def find_or_create_place(name, country_name)
    country = country_name && RegistryEntry.find_or_create_descendant('places', "#{I18n.locale}::#{country_name}")
    place = name && RegistryEntry.find_or_create_descendant(country ? country.entry_code : 'places', "#{I18n.locale}::#{name}")
    binding.pry
    place
  end

  def create_reference(registry_entry_id, interview, ref_object, ref_type_id=nil)
    rr = RegistryReference.create registry_entry_id: registry_entry_id, ref_object_id: ref_object.id, ref_object_type:ref_object.class.name, registry_reference_type_id: ref_type_id, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: interview.id
    binding.pry
    rr
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'metadata_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end
end
