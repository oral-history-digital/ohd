require 'test_helper'

class CustomDeviseMailerTest < ActionMailer::TestCase
  include ActiveJob::TestHelper

  setup do
    @umbrella = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a",
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
end
