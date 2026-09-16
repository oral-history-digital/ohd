require 'test_helper'
require 'minitest/mock'

class SearchesControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  test 'suggestion archive IDs use separate global and project cache namespaces' do
    project = DataHelper.test_project(shortname: 'global')
    cache = ActiveSupport::Cache::MemoryStore.new
    computations = 0
    archive_ids = ->(*) { computations += 1; ["archive#{computations}"] }
    dropdown = { all_interviews_titles: [], all_interviews_pseudonyms: [] }
    @request.host = URI.parse(OHD_DOMAIN).host
    @request.port = URI.parse(OHD_DOMAIN).port

    Rails.stub(:cache, cache) do
      Interview.stub(:dropdown_search_values, dropdown) do
        Interview.stub(:archive_ids_by_alphabetical_order, archive_ids) do
          @controller.stub(:current_project, project) do
            get :suggestions, params: { locale: 'en', format: :json }
            assert_response :success
            assert_equal ['archive1'], JSON.parse(response.body)['sorted_archive_ids']
          end
          @controller.stub(:current_project, nil) do
            2.times do
              get :suggestions, params: { locale: 'en', format: :json }
              assert_response :success
              assert_equal ['archive2'], JSON.parse(response.body)['sorted_archive_ids']
            end
          end
        end
      end
    end

    suffix = "sorted_archive_ids-#{Interview.maximum(:created_at)}"
    assert cache.exist?("global-#{suffix}")
    assert cache.exist?("project-#{project.id}-#{suffix}")
    assert_equal 2, computations
  end
end
