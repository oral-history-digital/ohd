class InterviewReference < UserContent

  def default_title(locale)
    title_tokens = [Interview.human_name(:locale => locale)]
    title_tokens << reference.archive_id.upcase
    title_tokens << reference.full_title(locale)
    title_tokens.join(' ')
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
    ref
  end

end
