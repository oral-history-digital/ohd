require 'rails_helper'

RSpec.describe InterviewMetadata do
  it 'exports to CMDI XML correctly' do
    md = InterviewMetadata.new
    md.creation_date = Date.parse('2021/01/01')
    md.tape_count = 3
    md.project_id = 'ohd_zwar_001';
    md.name = 'za001'
    md.num_speakers = 3
    md.corpus_name = 'Test collection'
    md.recording_date = Date.parse('2021/03/10')
    md.dominant_language = 'ru'
    md.actors = [
      { role: 'interviewee', code: 'INE', age: 49, sex: 'female' },
      { role: 'interviewer', code: 'INR1', age: 25, sex: 'male' },
      { role: 'interviewer', code: 'INR2', age: 40, sex: 'female' }
    ]
    md.topic = 'Test interviews'

    expect(md.to_xml).to match_snapshot('test_interview_cmdi')
  end
end
