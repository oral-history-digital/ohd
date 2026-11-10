require 'test_helper'

class ProjectMetadataTest < ActiveSupport::TestCase
  test 'CMDI exports known languages when a project uses an unknown locale' do
    metadata = ProjectMetadata.new
    metadata.metadata_resources = []
    metadata.documentation_languages = %w[en unknown]
    metadata.subject_languages = %w[de unknown]
    metadata.description_lang = 'unknown'
    metadata.description = 'Project description'
    metadata.media_types = []
    metadata.mime_types = []

    xml = Nokogiri::XML(metadata.to_xml).remove_namespaces!
    assert_equal ['eng'], xml.xpath('//DocumentationLanguages//iso-639-3-code').map(&:text)
    assert_equal ['deu'], xml.xpath('//SubjectLanguages//iso-639-3-code').map(&:text)
    assert_equal 'ISO639-3:und', xml.at_xpath('//Description/Description')['LanguageID']
  end
end
