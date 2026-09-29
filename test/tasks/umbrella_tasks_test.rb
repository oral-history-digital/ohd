require 'test_helper'
require 'minitest/mock'
require 'rake'

class UmbrellaTasksTest < ActiveSupport::TestCase
  def setup
    @original_rake_application = Rake.application
    Rake.application = Rake::Application.new
    Rake::Task.define_task(:environment)
    %w[roles maintenance bootstrap].each do |name|
      load Rails.root.join("lib/tasks/#{name}.rake")
    end
    @umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @former_umbrella = Project.find_by!(shortname: 'ohd')
  end

  def teardown
    Rake.application = @original_rake_application
    super
  end

  test 'default roles exclude configured umbrella but include former ohd' do
    # Existing roles must not hide an incorrect shortname-based exclusion.
    assert_empty @umbrella.roles
    assert_empty @former_umbrella.roles

    Rake::Task['roles:create_default_roles_and_permissions'].invoke

    assert_empty @umbrella.roles.reload
    assert @former_umbrella.roles.reload.exists?
  end

  test 'default data dispatch excludes configured umbrella but includes former ohd as normal project' do
    visited_projects = []
    original_project = $current_project
    # Stub child tasks: test project selection without rebuilding every archive.
    task = Rake::Task['maintenance:create_default_data']
    Rake::Task.stub(:[], ->(name) {
      Object.new.tap do |task|
        task.define_singleton_method(:invoke) do
          visited_projects << $current_project.id if name == 'maintenance:create_default_texts'
        end
      end
    }) do
      task.execute
    end

    assert_includes visited_projects, @former_umbrella.id
    assert_not_includes visited_projects, @umbrella.id
  ensure
    $current_project = original_project
  end

  test 'global verification accepts configured umbrella without a shortname lookup' do
    # Global checks unrelated to umbrella identity need only report existing data.
    TranslationValue.stub(:count, 1) do
      Role.stub(:count, 1) do
        Permission.stub(:count, 1) do
          Project.stub(:find_by, ->(*) { flunk 'Must not look up umbrella by shortname' }) do
            output, = capture_io { Rake::Task['bootstrap:verify'].invoke }
            assert_includes output, 'Bootstrap verify passed'
          end
        end
      end
    end
  end

  test 'global verification does not initialize missing settings from former ohd' do
    InstanceSetting.where(singleton_key: InstanceSetting::SINGLETON_KEY).delete_all

    error = assert_raises(RuntimeError) { Rake::Task['bootstrap:verify'].invoke }

    assert_equal 'Missing configured umbrella project', error.message
    assert_not InstanceSetting.exists?(singleton_key: InstanceSetting::SINGLETON_KEY)
  end
end
