require 'test_helper'

class ProjectCreatorTest < ActiveSupport::TestCase
  def setup
    @project_params = {
      name: 'test',
      shortname: ('a'..'z').to_a.shuffle[0, 4].join,
      default_locale: 'en',
      pseudo_available_locales: "en,de",
      contact_email: 'manager@archive.com'
    }
    @user = User.find_by(email: 'alice@example.com')
    @project = ProjectCreator.perform(@project_params, @user)
  end

  test 'initializes variables' do
    creator = ProjectCreator.new(@project_params, @user)
    assert_equal @project_params, creator.project_params
    assert_equal @user, creator.user
  end

  test 'creates default registry_name_types' do
    assert @project.registry_name_types.where(code: 'spelling').exists?
    assert @project.registry_name_types.where(code: 'ancient').exists?
  end

  %w(root places people subjects).each do |code|
    test "creates default #{code} registry_entry" do
      assert @project.registry_entries.where(code: code).exists?
    end
  end

  test 'creates two translations for registry names' do
    name = @project.registry_entries.where(code: 'places').first.registry_names.first
    assert_equal 2, name.translations.count
  end

  %w(birth_location home_location interview_location).each do |code|
    test "creates default #{code} registry_reference_type" do
      assert @project.registry_reference_types.where(code: code).exists?
    end

    test "creates default #{code} registry_reference_type_metadata_field" do
      registry_reference_type_id = @project.registry_reference_types.where(code: code).first.id
      assert @project.registry_reference_type_metadata_fields.where(
        registry_reference_type_id: registry_reference_type_id,
        source: 'RegistryReferenceType'
      ).exists?
    end
  end

  test 'creates 16 interview_metadata_fields' do
    assert_equal 16, @project.metadata_fields.where(source: 'Interview').count
  end

  test 'creates an interview_metadata_field with the right attributes (sample)' do
    record = @project.metadata_fields.where(name: 'workflow_state').first

    assert record.use_as_facet
    assert_equal 8.0, record.facet_order
    assert record.use_in_details_view
    refute record.use_in_map_search
    assert_equal 1.0, record.list_columns_order
    assert_equal 2, record.translations.count
  end

  test 'creates 5 interviewee_metadata_fields' do
    assert_equal 5, @project.metadata_fields.where(source: 'Person').count
  end

  test 'creates interviewee contribution_type' do
    assert @project.contribution_types.where(code: 'interviewee').exists?
  end

  test 'creates 14 contribution_types' do
    assert_equal 14, @project.contribution_types.count
  end

  test 'creates 17 task_types' do
    assert_equal 14, @project.contribution_types.count
  end

  test 'creates 5 roles' do
    assert_equal 5, @project.roles.count
  end

  test 'creates 8 media_streams' do
    assert_equal 8, @project.media_streams.count
  end

  test 'creates Erschliessung-role' do
    erschliessung_role = @project.roles.where(name: 'Erschliessung').first
    assert erschliessung_role.present?
    assert_equal 44, erschliessung_role.permissions.count
  end

  test 'has all upload-types' do
    assert_equal ["bulk_metadata", "bulk_texts", "bulk_registry_entries", "bulk_photos"], @project.upload_types
  end
end
