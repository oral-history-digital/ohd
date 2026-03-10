project1 = Project.where(shortname: 'test').first
language1 = Language.where(code: 'en').first
person1 = Person.first
collection1 = project1.collections.first

archive_id = "#{project1.shortname}#{'1'.rjust(project1.archive_id_number_length || 3, '0')}"

interview1 = Interview.find_or_initialize_by(project: project1, archive_id: archive_id)
interview1.collection = collection1
interview1.media_type = 'video'
interview1.description = 'This is the first test interview.'
interview1.workflow_state = 'public'
interview1.save!

InterviewLanguage.find_or_create_by!(interview: interview1, language: language1, spec: 'primary')

tape1 = Tape.find_or_create_by!(interview: interview1, media_id: 't001_2_1') do |tape|
  tape.video = true
end

tape2 = Tape.find_or_create_by!(interview: interview1, media_id: 't001_2_2') do |tape|
  tape.video = true
end

interviewee_type = ContributionType.find_or_initialize_by(project: project1, code: 'interviewee')
interviewee_type.label = 'Interviewee'
interviewee_type.save!

contribution1 = Contribution.find_or_create_by!(
  contribution_type: interviewee_type,
  interview: interview1,
  person: person1
)
