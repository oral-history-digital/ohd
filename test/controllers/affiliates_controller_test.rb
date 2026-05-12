require "test_helper"

class AffiliatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @affiliate = affiliates(:one)
  end

  test "should get index" do
    get affiliates_url
    assert_response :success
  end

  test "should get new" do
    get new_affiliate_url
    assert_response :success
  end

  test "should create affiliate" do
    assert_difference("Affiliate.count") do
      post affiliates_url, params: { affiliate: { name: @affiliate.name, name_type: @affiliate.name_type, project_id: @affiliate.project_id, type: @affiliate.type, url: @affiliate.url } }
    end

    assert_redirected_to affiliate_url(Affiliate.last)
  end

  test "should show affiliate" do
    get affiliate_url(@affiliate)
    assert_response :success
  end

  test "should get edit" do
    get edit_affiliate_url(@affiliate)
    assert_response :success
  end

  test "should update affiliate" do
    patch affiliate_url(@affiliate), params: { affiliate: { name: @affiliate.name, name_type: @affiliate.name_type, project_id: @affiliate.project_id, type: @affiliate.type, url: @affiliate.url } }
    assert_redirected_to affiliate_url(@affiliate)
  end

  test "should destroy affiliate" do
    assert_difference("Affiliate.count", -1) do
      delete affiliate_url(@affiliate)
    end

    assert_redirected_to affiliates_url
  end
end
