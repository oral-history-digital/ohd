require 'test_helper'
require 'minitest/mock'

class InterviewArchiveSearchTest < ActiveSupport::TestCase
  # Stand in for Sunspot's query builder so we can inspect project filters
  # without executing a search or depending on a populated Solr index.
  class Query
    attr_reader :filters

    def initialize
      @filters = []
    end

    def with(*args)
      @filters << args
    end

    def dynamic(*, &block)
      # Nested DSL blocks must run against this stand-in, just as in Sunspot.
      instance_eval(&block) if block
    end

    # Text matching, sorting, and pagination are outside this test's scope.
    def fulltext(*)
    end

    def order_by(*)
    end

    def paginate(*)
    end
  end

  setup do
    # Deliberately separate umbrella identity from the legacy shortname:
    # the project named 'ohd' must now behave like any other archive.
    @umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @archive = Project.find_by!(shortname: 'ohd')
  end

  test 'umbrella browsing searches public projects while former ohd searches itself' do
    query = capture_search(nil, @umbrella, {})
    assert_includes query.filters, [:project_id, Project.where(workflow_state: 'public').pluck(:id)]

    query = capture_search(nil, @archive, {})
    assert_includes query.filters, [:project_id, @archive.id]
  end

  test 'umbrella fulltext searches only accessible projects' do
    user = User.find_by!(email: 'john@example.com')
    access = UserProject.create!(user: user, project: @archive)
    # Set up granted access without triggering the grant event's mail workflow.
    access.update_columns(workflow_state: 'project_access_granted')

    query = capture_search(user, @umbrella, fulltext: 'history')
    assert_includes query.filters, [:project_id, user.accessible_projects.pluck(:id)]

    query = capture_search(user, @archive, fulltext: 'history')
    assert_includes query.filters, [:project_id, @archive.id]
  end

  private

  def capture_search(user, project, params)
    query = Query.new
    # Execute the real archive_search DSL block with Query as its receiver.
    search = ->(&block) { query.instance_eval(&block); query }
    # Replace only the search execution boundary. Minitest restores the
    # original Interview.search method when this block finishes.
    Interview.stub(:search, search) do
      Interview.archive_search(user, project, :en, params)
    end
    query
  end
end
