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

  test 'full and update responses include actual tape numbers in order' do
    interview.tapes.first.update_column(:number, 12)
    Tape.create!(interview: interview, number: 3, media_id: "#{interview.archive_id}_tape_selection_3")

    assert_equal [3, 12], InterviewSerializer.new(interview).attributes[:tape_numbers]
    assert_equal [3, 12], InterviewUpdateSerializer.new(interview, changes: []).attributes[:tape_numbers]
  end
end
