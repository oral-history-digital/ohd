class ReadCampscapeFileJob < ApplicationJob
  queue_as :default

  def perform(file_path)
    # TODO: implement
    # TODO: index and cache interviews, people, registry_entries, etc.
    read_file(file_path)
    File.delete(file_path) if File.exist?(file_path)
    # TODO: send mail to someone informing about finished interview
  end

  def read_file(file_path)
    #File.open("/home/grgr/Documents/arbeit/fu/Campscapes/campscapes-jasenovac-2018-07-13.csv", "r") do |f| f.each_line do |line| p line end end
    #File.foreach('testfile') {|x| print "GOT", x }
    content = File.readlines file_path
    content[4..(content.length - 1)].each do |line|
      data = line.split(;)
      unless data[1].blank?
        interviewee = Person.find_or_create_by first_name: data[1], birth_name: data[2], last_name: data[3], other_first_name: data[4], gender: data[5], date_of_bith: data[6] || data[7]
        interview_date = Date.parse(data[17])
        interview = interviewee.interviews.where(interview_date: interview_date.strftime("%d.%m.%Y")) if interview_date

        interview_data = {
          interview_date: interview_date,
          collection_id = find_collection_id(data[12])
          language_id = find_language_id(data[16])
          duration = data[22]
        }

        if interview
          interview.update_attributes interview_data
        else
          interview = Interview.create interview_data
        end

        Contribution.find_or_create_by person_id: interviewee.id, interview_id: interview.id, contribution_type: Project.contribution_types['interviewee']

        group_id = find_group_id(data[8])
        create_reference(group_id, interview) if group_id
      end
    end
  end

  def report
    @report ||= ''
  end

  def find_group_id
    group_id = nil
    # the following group_names contain only the first registry_name of a registry_entry with all it s translations!!
    RegistryEntry.find_by_entry_code('forced_labor_groups').children.each do |c| 
      group_id = c.id if c.registry_names.first.translations.map(&:descriptor).include?(data[8])
    end
    group_id
  end

  def find_collection_id(name)
    collection_id = nil
    Collection.all.each do |c| 
      collection_id = c.id if c.translations.map(&:name).include?(name)
    end
    collection_id
  end

  def find_language_id(name)
    language_id = nil
    lang = ISO_639.find(data[16])
    if lang
      language = Language.find_by_code(lang.alpha3_terminologic) 
      language_id = language && language.id
    end
    language_id
  end

  def create_reference(registry_entry_id, interview)
    RegistryReference.create registry_entry_id: registry_entry_id, ref_object_id: interview.id, ref_object_type: "Interview", registry_reference_type_id: nil, ref_position: 0, original_descriptor: "", ref_details: "", ref_comments: "", ref_info: "", workflow_state: "checked", interview_id: interview.id
  end

end
