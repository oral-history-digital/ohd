require 'test_helper'

class InterviewUpdateSerializerTest < ActiveSupport::TestCase
  def interview
    @interview ||= Project.first.interviews.first
  end

  test 'skips nested attributes keys' do
    serializer = InterviewUpdateSerializer.new(
      interview,
      changes: %w(translations_attributes contributions_attributes)
    )

    hash = serializer.attributes

    refute hash.key?('translations_attributes')
    refute hash.key?('contributions_attributes')
  end

  test 'skips unknown keys instead of raising' do
    serializer = InterviewUpdateSerializer.new(
      interview,
      changes: %w(translations_attributess_attributes no_such_reader)
    )

    hash = serializer.attributes

    refute hash.key?('translations_attributess_attributes')
    refute hash.key?('no_such_reader')
  end

  test 'serializes known changed attributes' do
    serializer = InterviewUpdateSerializer.new(interview, changes: %w(archive_id))

    assert_equal interview.archive_id, serializer.attributes['archive_id']
  end

  test 'public_ keys map to properties' do
    serializer = InterviewUpdateSerializer.new(interview, changes: %w(public_attributes))

    assert_equal interview.properties, serializer.attributes[:properties]
  end
end
