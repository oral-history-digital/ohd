require "test_helper"

class UserTest < ActiveSupport::TestCase

  test 'can change password with all possible special signs' do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?
    user.update(password: 'NewPassword123#?!@$%^&*-+=')
    assert user.valid?
  end

  test 'accepts password with #?!@$%^&*+=_,.:;~-. as special sign' do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?

    special_signs = '#?!@$%^&*+=_,.:;~-.'.chars
    special_signs.each do |sign|
      user.update(password: "Abcdef1#{sign}")
      assert user.valid?, "Password with special sign '#{sign}' should be valid"
    end
  end

  test ['password needs',
    'upper- and downercase letter',
    'number and special sign',
    'and at least 8 characters'
  ].join do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?
    user.update(password: 'short')
    assert_not user.valid?
    user.update(password: 'alllowercase')
    assert_not user.valid?
    user.update(password: 'ALLUPPERCASE')
    assert_not user.valid?
    user.update(password: 'NoSpecialSign1')
    assert_not user.valid?
    user.update(password: 'NoNumber#')
    assert_not user.valid?
  end

  test 'display name only includes real academic titles' do
    user = User.find_by!(email: 'john@example.com')
    user.update!(first_name: 'Firstname', last_name: 'Lastname')

    user.update!(appellation: 'not_specified')
    assert_equal 'Firstname Lastname', user.display_name

    user.update!(appellation: 'dr')
    expected_title = TranslationValue.for('user.appellation.dr', I18n.locale)
    assert_equal [expected_title, 'Firstname Lastname'].join(' '), user.display_name
  end

end
