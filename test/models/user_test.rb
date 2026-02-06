require "test_helper"

class UserTest < ActiveSupport::TestCase

  test 'can change password with all possible special signs' do
    user = User.find_by!(email: 'john@example.com')
    assert user.valid?
    user.update(password: 'NewPassword123#?!@$%^&*-+=')
    assert user.valid?
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

end
