require 'test_helper'
require 'securerandom'

class ProjectLitePayloadBuilderTest < ActiveSupport::TestCase
  test 'builds payload structure for project lite serializer options' do
    project = DataHelper.test_project(shortname: "pl#{SecureRandom.hex(3)}a")

    payload = ProjectLitePayloadBuilder.perform(project)

    assert payload.key?(:interview_counts)
    assert payload.key?(:collection_counts)
    assert payload.key?(:interview_languages_by_project)
    assert payload.key?(:interview_year_ranges_by_project)
    assert payload.key?(:birth_year_ranges_by_project)
    assert payload.key?(:cache_key_suffix)

    assert payload[:cache_key_suffix].start_with?('project-lite-')
  end
end
