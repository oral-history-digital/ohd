require 'test_helper'
require 'minitest/mock'

class CustomDeviseMailerTest < ActionMailer::TestCase
  include ActiveJob::TestHelper

  setup do
    # Standalone mailer tests need Devise mappings from Rails' lazily loaded routes.
    Rails.application.reload_routes! if Devise.mappings.empty?
    @umbrella = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a",
      name: 'Shared platform',
      contact_email: 'umbrella@example.com'
    )
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @user = User.find_by!(email: 'john@example.com')
    @user.update!(mail_text: 'Account notice from the configured umbrella.')
  end

  %w(block revoke_block remove).each do |action|
    test "#{action} notice uses configured umbrella sender and account mail text" do
      assert_emails 1 do
        # Execute only mail jobs: removal must not delete the test user.
        perform_enqueued_jobs(only: ActionMailer::MailDeliveryJob) do
          @user.public_send(action)
        end
      end

      message = ActionMailer::Base.deliveries.last
      assert_equal [@umbrella.contact_email], message.from
      assert_equal [@umbrella.contact_email], message.reply_to
      assert_includes message.html_part.body.decoded, @user.mail_text
      assert_includes message.text_part.body.decoded, @user.mail_text
    end
  end

  test 'registration confirmation uses configured umbrella branding and authentication origin' do
    @user.update!(default_locale: 'en')
    @user.confirmation_token = 'confirmation-token'
    message = CustomDeviseMailer.confirmation_instructions(@user, 'confirmation-token').message

    assert_umbrella_authentication_mail(message, '/en/users/confirmation?confirmation_token=confirmation-token')
    assert_equal [@user.email], message.to
  end

  test 'changed email confirmation uses configured umbrella branding and authentication origin' do
    @user.update!(default_locale: 'en')
    # Set reconfirmation state without triggering an automatic email in setup.
    @user.unconfirmed_email = 'changed@example.com'
    @user.confirmation_token = 'changed-email-token'
    # Devise passes the new recipient explicitly when sending reconfirmation.
    message = CustomDeviseMailer.confirmation_instructions(
      @user, 'changed-email-token', to: @user.unconfirmed_email
    ).message

    assert_umbrella_authentication_mail(message, "/en/users/#{@user.id}/confirm_new_email?confirmation_token=changed-email-token")
    assert_equal ['changed@example.com'], message.to
  end

  test 'password reset uses configured umbrella rather than requesting archive branding' do
    @user.update!(default_locale: 'en')
    archive = Project.find_by!(shortname: 'ohd')
    message = CustomDeviseMailer.reset_password_instructions(@user, 'reset-token', project: archive).message

    assert_umbrella_authentication_mail(message, '/en/users/password/edit?reset_password_token=reset-token')
    assert_equal [@user.email], message.to
  end

  test 'password reset uses umbrella name in recipient locale' do
    @user.update!(default_locale: 'de')
    Globalize.with_locale(:de) { @umbrella.update!(name: 'Konfigurierte Plattform') }
    message = CustomDeviseMailer.reset_password_instructions(@user, 'reset-token').message

    assert_umbrella_authentication_mail(message, '/de/users/password/edit?reset_password_token=reset-token')
  end

  test 'two-factor authentication code uses configured umbrella sender' do
    message = CustomDeviseMailer.two_factor_authentication_code(@user, '123456').message

    assert_equal [@umbrella.contact_email], message.from
    assert_equal [@umbrella.contact_email], message.reply_to
  end

  test 'authentication mail subjects use configured umbrella display name' do
    @umbrella.update!(display_shortname: 'shared')
    @user.update!(default_locale: 'en')
    original_translation = TranslationValue.method(:for)
    translation = ->(key, locale, **values) do
      if key.start_with?('devise.mailer.') && key.end_with?('.subject')
        values.fetch(:umbrella_project_name)
      else
        original_translation.call(key, locale, **values)
      end
    end

    TranslationValue.stub(:for, translation) do
      confirmation = CustomDeviseMailer.confirmation_instructions(@user, 'confirmation-token').message
      reset = CustomDeviseMailer.reset_password_instructions(@user, 'reset-token').message

      assert_equal 'Shared platform (shared)', confirmation.subject
      assert_equal 'Shared platform (shared)', reset.subject

      perform_enqueued_jobs(only: ActionMailer::MailDeliveryJob) { @user.revoke_block }
      assert_equal 'Shared platform (shared)', ActionMailer::Base.deliveries.last.subject
    end
  end

  private

  def assert_umbrella_authentication_mail(message, path)
    assert_equal [@umbrella.contact_email], message.from
    assert_equal [@umbrella.contact_email], message.reply_to
    [message.html_part, message.text_part].each do |part|
      body = part.body.decoded
      assert_includes body, @umbrella.name(@user.default_locale)
      assert_includes body, "#{OHD_DOMAIN}#{path}"
    end
  end
end
