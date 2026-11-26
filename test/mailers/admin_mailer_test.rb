require 'test_helper'
require 'minitest/mock'

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

  test 'import diagnostics use the recipient language and escape uploaded values in HTML' do
    @umbrella.update!(available_locales: %w[en de])
    @user.update!(default_locale: 'de')
    error = Timecode::ImportFormatError.new(ImportValidation.issue(
      'timecode.minutes_out_of_range', params: { value: '<script>bad</script>' }, location: { row: 2 }
    ))
    rendered = "timecode.minutes_out_of_range <script>bad</script>\nsecond issue"
    renderer = Minitest::Mock.new
    renderer.expect(:call, rendered, [error.issues, 'de'])
    ImportValidationMessages.stub(:render, renderer) do
      message = AdminMailer.with(
        receiver: @user, project: @umbrella, type: 'read_transcript', error: error
      ).finished_job.message

      assert_includes message.text_part.decoded, rendered
      assert_includes message.html_part.decoded, '&lt;script&gt;bad&lt;/script&gt;'
      assert_includes message.html_part.decoded, '<br>'
      refute_includes message.html_part.decoded, '<script>'
    end
    renderer.verify
  end
end
