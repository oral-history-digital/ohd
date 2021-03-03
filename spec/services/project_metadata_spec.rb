require 'rails_helper'

RSpec.describe ProjectMetadata do
  it 'exports to CMDI XML correctly' do
    md = ProjectMetadata.new
    md.self_link = 'http://www.example.com/'
    md.creation_date = Date.parse('2021/01/01')
    md.metadata_resources = ['za_001', 'za_002', 'za_003']
    md.documentation_url = 'http://www.example.com/archive/'
    md.documentation_languages = ['en', 'de', 'fr']
    md.num_interviews = 3
    md.name = 'Test'
    md.title = 'The Test Archive'
    md.id = 'test'
    md.owner = 'Free University of Berlin'
    md.publication_year = '2000'
    md.description = 'This archive exists for testing purposes only…'
    md.description_lang = 'en'
    md.media_types = ['video', 'audio']
    md.mime_types = { 'video' => 'video/mp4', 'audio' => 'audio/x-wav' }

    expect(md.to_xml).to match_snapshot('test_project_cmdi')
  end
end
