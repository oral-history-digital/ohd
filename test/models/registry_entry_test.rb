require "test_helper"

class RegistryEntryTest < ActiveSupport::TestCase
  def setup
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview1 = DataHelper.interview_with_everything(@project, 1, false)
    @interview2 = DataHelper.interview_with_everything(@project, 2, false)
    @registry_entry = RegistryEntry.create!(
      project: @project,
      code: 'test_entry',
      workflow_state: 'public'
    )
    
    # Create registry references with archive_ids
    RegistryReference.create!(
      registry_entry: @registry_entry,
      ref_object_type: 'Interview',
      ref_object_id: @interview1.id,
      interview_id: @interview1.id,
      archive_id: @interview1.archive_id,
      workflow_state: 'checked',
      ref_position: 0
    )
    
    RegistryReference.create!(
      registry_entry: @registry_entry,
      ref_object_type: 'Interview',
      ref_object_id: @interview2.id,
      interview_id: @interview2.id,
      archive_id: @interview2.archive_id,
      workflow_state: 'checked',
      ref_position: 0
    )
  end

  def registry_entry
    @registry_entry
  end

  test "searchable archive_id returns archive IDs from registry references" do
    # Should return archive IDs from associated registry references
    archive_ids = registry_entry.registry_references.pluck(:archive_id)
    
    assert archive_ids.is_a?(Array), "Should return an array"
    assert_equal 2, archive_ids.length, "Should have 2 registry references"
    assert_includes archive_ids, @interview1.archive_id
    assert_includes archive_ids, @interview2.archive_id
  end

end
