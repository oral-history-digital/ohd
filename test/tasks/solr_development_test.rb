require 'test_helper'
require 'minitest/mock'
require 'rake'

class SolrDevelopmentTest < ActiveSupport::TestCase
  def setup
    super
    @original_rake_application = Rake.application
    Rake.application = Rake::Application.new
    Rake::Task.define_task(:environment)
    load Rails.root.join('lib/tasks/solr_development.rake')
    @original_env = ENV.to_h.slice(*task_env_keys)
    task_env_keys.each { |key| ENV.delete(key) }
  end

  def teardown
    task_env_keys.each { |key| ENV.delete(key) }
    ENV.update(@original_env)
    Rake.application = @original_rake_application
    super
  end

  test 'collection filter works without a project filter' do
    ENV.update('MODEL' => 'Interview', 'COLLECTION_ID' => '123', 'BATCH_SIZE' => '100')
    scope = Minitest::Mock.new
    scope.expect(:where, scope, [], collection_id: '123')
    scope.expect(:count, 0)

    output = invoke_with_scope(scope)

    assert_includes output, 'Collection ID: 123'
    scope.verify
  end

  test 'collection filter combines with project ID and limit' do
    ENV.update('COLLECTION_ID' => '123', 'PROJECT_ID' => '42', 'LIMIT' => '10', 'BATCH_SIZE' => '100')
    scope = Minitest::Mock.new
    scope.expect(:where, scope, [], project_id: 42)
    scope.expect(:where, scope, [], collection_id: '123')
    scope.expect(:limit, scope, [10])
    scope.expect(:count, 0)

    output = invoke_with_scope(scope)

    assert_includes output, 'Collection ID: 123'
    assert_includes output, 'Batch size: 100'
    scope.verify
  end

  test 'collection filter combines with project shortname' do
    ENV.update('COLLECTION_ID' => '123', 'PROJECT_SHORTNAME' => 'za')
    scope = Minitest::Mock.new
    scope.expect(:where, scope, [], project_id: 42)
    scope.expect(:where, scope, [], collection_id: '123')
    scope.expect(:count, 0)
    project = Struct.new(:id).new(42)

    Project.stub(:find_by!, ->(shortname:) { assert_equal 'za', shortname; project }) do
      invoke_with_scope(scope)
    end

    scope.verify
  end

  test 'absent or blank collection leaves scope unchanged' do
    [nil, ''].each do |collection_id|
      ENV['COLLECTION_ID'] = collection_id
      scope = Minitest::Mock.new
      scope.expect(:count, 0)

      Collection.stub(:exists?, ->(*) { flunk 'Must not validate an absent collection' }) do
        output = invoke_with_scope(scope, validate_collection: false)
        assert_includes output, 'Collection ID: all'
      end

      scope.verify
    end
  end

  test 'missing collection exits with status one' do
    ENV['COLLECTION_ID'] = '123'

    Collection.stub(:exists?, ->(id:) { assert_equal '123', id; false }) do
      output = invoke_task(1)
      assert_includes output, "Error: Collection with ID '123' not found"
    end
  end

  test 'model without collection column exits with status one' do
    ENV['COLLECTION_ID'] = '123'

    Interview.stub(:column_names, ['id', 'project_id']) do
      Collection.stub(:exists?, ->(*) { flunk 'Must reject unsupported model first' }) do
        output = invoke_task(1)
        assert_includes output, "Error: Model 'Interview' has no collection_id column"
      end
    end
  end

  private

  def task_env_keys
    %w[MODEL PROJECT_SHORTNAME PROJECT_ID COLLECTION_ID LIMIT BATCH_SIZE WITH_RELATED]
  end

  def invoke_with_scope(scope, validate_collection: true)
    Interview.stub(:all, scope) do
      if validate_collection
        Collection.stub(:exists?, ->(id:) { assert_equal '123', id; true }) { invoke_task(0) }
      else
        invoke_task(0)
      end
    end
  end

  def invoke_task(status)
    output, = capture_io do
      error = assert_raises(SystemExit) { Rake::Task['solr:reindex:scoped'].execute }
      assert_equal status, error.status
    end
    output
  end
end
