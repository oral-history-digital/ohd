require 'test_helper'

class EmailChangesControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @user = User.find_by!(email: 'john@example.com')
    @old_email = @user.email
    @token = 'pending-email-confirmation'
    @user.update_columns(
      unconfirmed_email: 'changed@example.com',
      confirmation_token: @token,
      confirmation_sent_at: Time.current
    )
  end

  test 'owner can cancel a pending email change and keeps the current email' do
    sign_in @user
    delete '/en/users/current/cancel_email_change.json'
    assert_response :success
    payload = JSON.parse(response.body)
    assert_equal 'current', payload.fetch('id')
    assert_equal 'users', payload.fetch('data_type')
    assert_nil payload.fetch('data').fetch('unconfirmed_email')
    assert_equal @old_email, @user.reload.email
    assert_nil @user.unconfirmed_email
    assert_nil @user.confirmation_token
    assert_nil @user.confirmation_sent_at

    delete '/en/users/current/cancel_email_change.json'
    assert_response :success
  end

  test 'cancelled confirmation links and missing tokens cannot sign users in' do
    sign_in @user
    delete '/en/users/current/cancel_email_change.json'
    delete '/en/users/sign_out'

    [@token, nil].each do |token|
      get "/en/users/#{@user.id}/confirm_new_email", params: { confirmation_token: token }
      assert_response :unprocessable_entity
      assert_equal @old_email, @user.reload.email
      get '/en/users/current.json'
      assert_nil JSON.parse(response.body).fetch('data')
    end
  end

  test 'numeric IDs cannot cancel either the owners or the callers pending change' do
    admin = User.find_by!(email: 'alice@example.com')
    admin.update_columns(unconfirmed_email: 'admin-changed@example.com', confirmation_token: 'admin-token')
    sign_in admin

    [@user.id, admin.id].each do |id|
      delete "/en/users/#{id}/cancel_email_change.json"
      assert_response :not_found
      assert_equal 'changed@example.com', @user.reload.unconfirmed_email
      assert_equal @token, @user.confirmation_token
      assert_equal 'admin-changed@example.com', admin.reload.unconfirmed_email
      assert_equal 'admin-token', admin.confirmation_token
    end
  end

  test 'anonymous callers cannot cancel a pending change' do
    delete "/en/users/#{@user.id}/cancel_email_change.json"
    assert_response :unauthorized
    assert_equal 'changed@example.com', @user.reload.unconfirmed_email
  end

  test 'owner can cancel through a project and locale aware route' do
    sign_in @user
    delete '/ohd/de/users/current/cancel_email_change.json'
    assert_response :success
    assert_nil @user.reload.unconfirmed_email
  end

  test 'a valid pending email confirmation still succeeds' do
    get "/en/users/#{@user.id}/confirm_new_email", params: { confirmation_token: @token }
    assert_response :redirect
    assert_equal 'changed@example.com', @user.reload.email
    assert_equal @user.email, @user.login
    assert_nil @user.unconfirmed_email
  end

  test 'duplicate email update returns validation errors without changing the account or sending mail' do
    sign_in @user
    original_attributes = @user.attributes.slice('email', 'unconfirmed_email', 'confirmation_token', 'confirmation_sent_at')

    assert_no_difference 'ActionMailer::Base.deliveries.size' do
      put '/ohd/de/users/current.json', params: { user: { email: 'alice@example.com' } }
    end
    assert_response :unprocessable_entity
    payload = JSON.parse(response.body)
    assert payload.fetch('error').present?
    assert payload.fetch('errors').fetch('email').present?
    assert_equal original_attributes, @user.reload.attributes.slice(*original_attributes.keys)
  end

  test 'successful email update returns a pending change and sends confirmation' do
    sign_in @user
    assert_difference 'ActionMailer::Base.deliveries.size', 1 do
      put '/en/users/current.json', params: { user: { email: 'new-address@example.com' } }
    end
    assert_response :success
    payload = JSON.parse(response.body)
    assert_equal 'current', payload.fetch('id')
    assert_equal 'new-address@example.com', payload.fetch('data').fetch('unconfirmed_email')
    assert_equal @old_email, @user.reload.email
    assert_equal 'new-address@example.com', @user.unconfirmed_email
  end

  test 'another user cannot update the owners email' do
    admin = User.find_by!(email: 'alice@example.com')
    sign_in @user
    put "/en/users/#{admin.id}.json", params: { user: { email: 'other-address@example.com' } }
    assert_response :forbidden
    assert_equal 'alice@example.com', admin.reload.email
    assert_nil admin.unconfirmed_email
  end
end
