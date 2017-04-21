class InterviewReference < UserContent

  def interview_references=(list_of_archive_ids)
    if list_of_archive_ids.is_a?(String)
      list_of_archive_ids = list_of_archive_ids.scan(Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)).map{|id| id.downcase }
    end
    self.reference = Interview.find_by_archive_id(list_of_archive_ids.first)
    write_attribute :interview_references, list_of_archive_ids.to_yaml
  end

  def default_title(locale)
    title_tokens = [Interview.human_name(:locale => locale)]
    title_tokens << reference.archive_id.upcase
    title_tokens << reference.full_title(locale)
    title_tokens.join(' ')
  end

  # provides user_content attributes for new user_content
  # except the link_url, which is generated in the view
  def user_content_attributes
    attr = {}
    attr[:interview_references] = reference.archive_id
    attr[:properties] = {
            :citation => '',
            :video => reference.video?,
            :language => reference.language,
            :translated => reference.translated,
            :duration => reference.duration.timecode,
            :segmented => reference.segmented,
            :table_of_contents => reference.researched
    }
    attr
  end

  # path to show the resource
  def get_content_path
    interview_path(:id => reference.archive_id)
  end

  # sets the archive_id as id_hash instead of default
  def self.default_id_hash(instance)
    instance.reference.blank? ? instance.read_property('interview_references') || 'blank_interview' : instance.reference.archive_id
  end

  def self.for_interview(interview)
    interview = case interview
      when Interview
        interview
      when String
        Interview.find_by_archive_id(interview.downcase)
      else
        nil
    end
    ref = InterviewReference.new
    ref.reference = interview
    ref.interview_references = interview.archive_id
    ref
  end

end
