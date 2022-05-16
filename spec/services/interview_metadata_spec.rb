require 'rails_helper'

RSpec.describe InterviewMetadata do
  it 'exports to CMDI XML correctly' do
    md = InterviewMetadata.new
    md.creation_date = Date.parse('2021/01/01')
    md.batch = 1
    md.media_type = 'video';
    md.mime_type = 'video/mp4';
    md.tape_paths = ['za001/za001_03_01.mp4', 'za001/za001_03_02.mp4', 'za001/za001_03_03.mp4']
    md.transcript_paths = ['za001/transcript_de.pdf', 'za001/transcript_en.pdf']
    md.project_id = 'zwar';
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
