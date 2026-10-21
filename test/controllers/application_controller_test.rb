require 'test_helper'
require 'minitest/mock'
require 'securerandom'
require_relative '../support/api_schema_assertions'

class ApplicationControllerTest < ActiveSupport::TestCase
  include ApiSchemaAssertions
  test 'cached project and interview responses hide unshared collection identity from readers' do
    project = DataHelper.test_project(shortname: "vis#{SecureRandom.hex(3)}a", workflow_state: 'public')
    collection = Collection.create!(project: project, name: 'Hidden collection', workflow_state: 'unshared')
    interview = Interview.create!(
      project: project, collection: collection, archive_id: "#{project.shortname}001",
      workflow_state: 'public', media_type: 'audio',
      interview_languages: [InterviewLanguage.new(language: Language.find_by!(code: 'eng'), spec: 'primary')]
    )
    shared = Collection.create!(project: project, name: 'Shared collection', workflow_state: 'public')
    reader = User.find_by!(email: 'john@example.com')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'show')
    role = Role.create!(project: project, name: 'Collection reader')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: reader, role: role)
    admin = User.find_by!(email: 'alice@example.com')
    cache = ActiveSupport::Cache::MemoryStore.new

    Rails.stub(:cache, cache) do
      [admin, reader, nil, admin].each do |user|
        controller = ApplicationController.new
        controller.define_singleton_method(:current_project) { project }
        controller.define_singleton_method(:current_user) { user }
        payload = controller.send(:cache_single, project)
        expected_ids = user == admin ? [collection.id, shared.id].sort : [shared.id]
        assert_equal expected_ids, payload[:collection_ids].sort
        assert_equal expected_ids, payload[:collections].keys.map(&:to_i).sort
        base_payload = controller.send(:cache_single, project, serializer_name: 'ProjectBase')
        assert_equal expected_ids, base_payload[:collection_ids].sort

        interview_payload = controller.send(:cache_single, interview, serializer_name: 'InterviewBase')
        assert_equal interview.archive_id, interview_payload[:archive_id]
        if user == admin
          assert_equal collection.id, interview_payload[:collection_id]
        else
          assert_nil interview_payload[:collection_id]
        end
      end
    end
  end

  test 'project serialization ignores cached legacy compatibility payloads' do
    project = DataHelper.test_project(shortname: "cch#{SecureRandom.hex(2)}a")
    setting = InstanceSetting.current
    setting.update!(umbrella_project: project)
    controller = ApplicationController.new
    controller.define_singleton_method(:current_project) { project }
    controller.define_singleton_method(:current_user) { nil }
    cache = ActiveSupport::Cache::MemoryStore.new
    legacy_key = "#{project.shortname}-project_base-#{project.id}-#{project.updated_at}--#{setting.cache_key_with_version}--#{I18n.locale}"
    cache.write(legacy_key, { is_ohd: true })

    Rails.stub(:cache, cache) do
      payload = controller.send(:cache_single, project, serializer_name: 'ProjectBase')

      assert payload[:is_umbrella]
      assert_not payload.key?(:is_ohd)
    end
  end

  test 'bootstrap uses localized API summaries and retains only stable routing fields outside them' do
    umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a", workflow_state: 'public')
    project = DataHelper.test_project(shortname: "cur#{SecureRandom.hex(2)}a", workflow_state: 'public')
    project.translations.find_or_initialize_by(locale: 'en').update!(name: 'English project')
    controller = ApplicationController.new
    controller.define_singleton_method(:current_user) { nil }

    payload = I18n.with_locale(:en) do
      controller.send(:build_initial_projects_payload, current_project: project, umbrella_project: umbrella)
    end
    assert_equal 'en', payload[:summaries][:locale]
    summaries = JSON.parse(payload[:summaries][:data].to_json)
    assert_equal [umbrella.id, project.id].sort, summaries.map { |record| record['id'] }.sort
    summaries.each { |record| assert api_schema.schema('ProjectSummary').valid?(record) }
    assert_equal 'English project', summaries.find { |record| record['id'] == project.id }['name']
    assert_equal({ id: umbrella.id, shortname: umbrella.shortname, archive_domain: umbrella.archive_domain.presence, is_umbrella: true },
      payload[:projects_data][umbrella.id.to_s])
    assert_equal %i[archive_domain id is_umbrella shortname], payload[:projects_data][project.id.to_s].keys.sort
    assert_not payload.key?(:project_representations)
  end

  test 'bootstrap excludes denied summaries and separates authorized cached content' do
    project = DataHelper.test_project(shortname: "prv#{SecureRandom.hex(2)}a", workflow_state: 'unshared')
    controller = ApplicationController.new
    account = User.find_by!(email: 'alice@example.com')
    controller.define_singleton_method(:current_user) { account }

    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      payload = controller.send(:build_initial_projects_payload, current_project: project, umbrella_project: project)
      assert_equal [project.id], payload[:summaries][:data].map { |record| record[:id] }
      assert_equal 1, payload[:projects_data].size
      account = nil
      payload = controller.send(:build_initial_projects_payload, current_project: project, umbrella_project: project)
      assert_empty payload[:summaries][:data]
      assert_equal project.id, payload[:projects_data][project.id.to_s][:id]
    end
  end

  test 'project serialization cache changes with umbrella setting' do
    project = DataHelper.test_project(shortname: "cch#{SecureRandom.hex(2)}a")
    setting = InstanceSetting.current
    setting.update!(umbrella_project: project)
    controller = ApplicationController.new
    controller.define_singleton_method(:current_project) { project }
    controller.define_singleton_method(:current_user) { nil }

    first_payload = controller.send(:cache_single, project, serializer_name: 'ProjectBase')
    setting.update!(umbrella_project: Project.find_by!(shortname: 'ohd'))
    second_payload = controller.send(:cache_single, project, serializer_name: 'ProjectBase')

    assert first_payload[:is_umbrella]
    assert_not second_payload[:is_umbrella]
  end
end
