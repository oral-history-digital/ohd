require 'test_helper'
require Rails.root.join('db/migrate/20260910100000_set_ohd_as_umbrella_project')

class SetOhdAsUmbrellaProjectTest < ActiveSupport::TestCase
  test 'overrides existing umbrella project with ohd' do
    previous_umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    setting = InstanceSetting.current
    setting.update!(umbrella_project: previous_umbrella)

    SetOhdAsUmbrellaProject.new.up

    assert_equal Project.find_by!(shortname: 'ohd'), setting.reload.umbrella_project
  end
end
