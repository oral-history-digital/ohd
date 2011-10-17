class InterviewReference < UserContent


  # provides user_content attributes for new user_content
  # except the link_url, which is generated in the view
  def user_content_attributes
    attr = {}
    title_tokens = [Interview.human_name]
    title_tokens << reference.archive_id.upcase
    title_tokens << reference.full_title
    attr[:title] = title_tokens.join(' ')
    attr[:interview_references] = reference.archive_id
    attr[:properties] = { :citation => ''}
    attr
  end

  # path to show the resource
  def get_content_path
    interview_path(reference)
  end

end