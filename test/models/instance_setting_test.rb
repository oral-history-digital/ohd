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

  test 'formats umbrella project name with its display shortname' do
    setting = InstanceSetting.current
    setting.umbrella_project.update!(display_shortname: 'portal')

    assert_equal "#{setting.umbrella_project.name(:en)} (portal)", setting.umbrella_project_brand_name(:en)

    setting.umbrella_project.update!(display_shortname: nil)

    assert_equal setting.umbrella_project.name(:en), setting.umbrella_project_brand_name(:en)
  end
end
