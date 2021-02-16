project1 = Project.where(shortname: 'test').first
language1 = Language.where(code: 'en').first
person1 = Person.first

interview1 = Interview.create(
  project: project1,
  archive_id: 't001',
  media_type: 'video',
  description: 'This is the first test interview.',
  language: language1,
  workflow_state: 'public'
)

tape1 = Tape.create(
  interview: interview1,
  media_id: 't001_2_1',
  video: true,
)

tape2 = Tape.create(
  interview: interview1,
  media_id: 't001_2_2',
  video: true,
)

contribution1 = Contribution.create(
  contribution_type: 'interviewee',
  interview: interview1,
  person: person1
)
