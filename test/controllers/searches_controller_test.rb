require 'test_helper'
require 'minitest/mock'

class SearchesControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  test 'collection facets respect collection visibility' do
    umbrella = DataHelper.test_project(shortname: "fac#{SecureRandom.hex(4)}a")
    public_project = DataHelper.test_project(
      shortname: "pub#{SecureRandom.hex(4)}a",
      workflow_state: 'public'
    )
    hidden_project = DataHelper.test_project(
      shortname: "hid#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )
    visible = Collection.create!(project: public_project, name: 'Visible collection', workflow_state: 'public')
    unshared = Collection.create!(project: public_project, name: 'Private collection', workflow_state: 'unshared')
    cross_project = Collection.create!(project: hidden_project, name: 'Hidden project collection', workflow_state: 'public')
    subfacets = [visible, unshared, cross_project].to_h do |collection|
      [collection.id.to_s, { name: { en: collection.name }, count: 1 }]
    end
    facet_data = { collection_id: { subfacets: subfacets }, media_type: { subfacets: { video: { count: 1 } } } }

    Interview.stub(:archive_search, Object.new) do
      umbrella.stub(:updated_search_facets, ->(*) { facet_data.deep_dup }) do
        @controller.stub(:current_project, umbrella) do
          get :facets, params: { locale: 'en', format: :json }
          assert_response :success
          anonymous_facets = JSON.parse(response.body).fetch('facets')
          assert_equal [visible.id.to_s], anonymous_facets.dig('collection_id', 'subfacets').keys
          assert anonymous_facets.key?('media_type')

          sign_in User.find_by!(email: 'alice@example.com')
          get :facets, params: { locale: 'en', format: :json }
          assert_response :success
          authorized_facets = JSON.parse(response.body).fetch('facets')
          assert_includes authorized_facets.dig('collection_id', 'subfacets').keys, unshared.id.to_s
          assert_includes authorized_facets.dig('collection_id', 'subfacets').keys, cross_project.id.to_s
        end
      end
    end
  end

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
