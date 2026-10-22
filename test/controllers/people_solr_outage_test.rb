require 'test_helper'
require 'minitest/mock'

# Verifies that write requests do not depend on a functioning Solr writer.
class PeopleSolrOutageTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper
  self.use_transactional_tests = false

  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: 'pilot', available_locales: %w[de en], default_locale: 'de')
    @event_type = EventType.create!(project: @project, code: 'birth', name: 'Birth')
    clear_enqueued_jobs
  end

  teardown do
    @project.reload.destroy!
    clear_enqueued_jobs
  end

  test 'person creation with nested events succeeds without contacting Solr' do
    sign_in User.find_by!(email: 'alice@example.com')
    failure = ->(*) { raise 'IndexWriter is closed: Solr must not run in the request' }

    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      Sunspot.stub(:index, failure) do
        Sunspot.stub(:index!, failure) do
          Sunspot.stub(:commit, failure) do
            assert_difference ['Person.count', 'Event.count'], 1 do
              post '/pilot/de/people', params: {
                person: {
                  project_id: Project.find_by!(shortname: 'test').id,
                  first_name: 'Outage', last_name: 'Person',
                  events_attributes: [{ event_type_id: @event_type.id,
                    start_date: '1950-01-01', end_date: '1950-01-01' }]
                }
              }, as: :json
            end
          end
        end
      end
    end

    assert_response :success
    payload = response.parsed_body
    person = Person.find(payload.fetch('nested_id'))
    assert_equal @project.id, person.project_id
    assert_equal @project.id, payload.fetch('id')
    assert_equal 'people', payload.fetch('nested_data_type')
    assert_equal person.id, payload.fetch('data').fetch('id')
    targets = enqueued_jobs.select { |job| job[:job] == RefreshSearchIndexJob }.last.fetch(:args).first
    assert_includes targets.fetch('Person'), person.id
    assert_includes targets.fetch('Event'), person.events.first.id
  end

  test 'request isolation preserves authorization for person creation' do
    sign_in User.find_by!(email: 'john@example.com')
    assert_no_difference ['Person.count', 'Event.count'] do
      assert_no_enqueued_jobs(only: RefreshSearchIndexJob) do
        post '/pilot/de/people', params: { person: { first_name: 'Denied', last_name: 'Person' } }, as: :json
      end
    end
    assert_response :forbidden
  end
end
