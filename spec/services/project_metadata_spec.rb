require 'rails_helper'

RSpec.describe ProjectMetadata do
  it 'exports to CMDI XML correctly' do
    md = ProjectMetadata.new
    md.creation_date = Date.parse('2021/01/01')
    md.metadata_resources = ['za_001', 'za_002', 'za_003']
    md.documentation_url = 'http://www.example.com/archive/'
    md.documentation_languages = ['en', 'de', 'fr']
    md.creator_name = 'Alice Henderson'
    md.creator_email = 'alice@example.com'
    md.creator_organisation = 'Alice Henderson University'
    md.creator_website = 'https://www.ahu.edu'
    md.num_interviews = 3
    md.title = 'The Test Archive'
    md.id = 'ohd_test_001'
    md.owner = 'Free University of Berlin'
    md.publication_year = '2000'
    md.description = 'This archive exists for testing purposes only…'
    md.description_lang = 'en'
    md.subject_languages = ['ell']
    md.media_types = ['video', 'audio', 'text']
    md.mime_types = ['video/mp4', 'audio/x-wav']

    expect(md.to_xml).to match_snapshot('test_project_cmdi')
  end
end
