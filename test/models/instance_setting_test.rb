require 'test_helper'

class InstanceSettingTest < ActiveSupport::TestCase
  test 'current creates singleton with umbrella project' do
    setting = InstanceSetting.current

    assert_equal 'default', setting.singleton_key
    assert setting.umbrella_project.present?
  end

  test 'singleton key is unique' do
    first = InstanceSetting.current

    duplicate = InstanceSetting.new(
      singleton_key: first.singleton_key,
      umbrella_project: first.umbrella_project
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:singleton_key], 'has already been taken'
  end
end
