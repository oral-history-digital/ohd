require 'test_helper'
require 'securerandom'

class CmdiMetadataExporterTest < ActiveSupport::TestCase
  setup do
    @project = DataHelper.test_project(shortname: "cm#{SecureRandom.hex(3)}a")
    Institution.create!(
      name: 'Test Institution',
      shortname: "ti-#{SecureRandom.hex(3)}",
      country: 'de',
      projects: [@project]
    )

    language = Language.create!(code: 'ger/rus', name: 'Deutsch/Russisch')
    @interview = DataHelper.test_interview(
      @project,
      interview_languages: [InterviewLanguage.new(language: language, spec: 'primary')]
    )
  end

  test 'project export splits composite language codes' do
    xml = ProjectMetadataExporter.new(@project).build.to_xml

    assert_equal ['German', 'Russian'], language_names(xml, '//SubjectLanguages')
  end

  test 'interview export uses first part of composite language code' do
    xml = InterviewMetadataExporter.new(@interview).build.to_xml

    assert_equal ['German'], language_names(xml, '//SubjectLanguages')
  end

  private

  def language_names(xml, path)
    doc = Nokogiri::XML(xml)
    doc.remove_namespaces!
    doc.xpath("#{path}//LanguageName").map(&:text)
  end
end
