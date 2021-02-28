class InterviewReference < UserContent

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
  # TODO: cleanup: delete this method!
  #def get_content_path
    #interview_path(:id => reference.archive_id)
  #end

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
    ref
  end

end
