require 'test_helper'

class AdminMailerTest < ActionMailer::TestCase
  setup do
    @umbrella = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a",
      contact_email: 'umbrella@example.com'
    )
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @user = User.find_by!(email: 'john@example.com')
  end

  test 'registration notifications use configured umbrella sender' do
    message = AdminMailer.with(user: @user, project: @umbrella).new_registration_info.message

    assert_equal [@umbrella.contact_email], message.from
    assert_equal [@umbrella.contact_email], message.reply_to
  end
end
