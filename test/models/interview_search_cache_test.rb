require 'test_helper'
require 'minitest/mock'

class InterviewSearchCacheTest < ActiveSupport::TestCase
  test 'global dropdown cache is separate from former ohd project cache' do
    project = Project.find_by!(shortname: 'ohd')
    # Identical timestamp suffixes expose the old global/project key collision.
    project.update_column(:updated_at, 1.day.from_now)
    searches = 0
    search = ->(*) { searches += 1; Struct.new(:hits).new([]) }

    Rails.stub(:cache, ActiveSupport::Cache::MemoryStore.new) do
      Interview.stub(:search, search) do
        2.times do
          Interview.dropdown_search_values(nil, nil)
          Interview.dropdown_search_values(project, nil)
        end
      end
    end

    assert_equal 2, searches, 'Each scope must compute once and then reuse only its own cache'
  end
end
