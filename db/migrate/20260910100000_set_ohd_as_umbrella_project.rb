class SetOhdAsUmbrellaProject < ActiveRecord::Migration[8.0]
  def up
    ohd_project = Project.find_by!(shortname: 'ohd')
    instance_setting = InstanceSetting.find_or_initialize_by(singleton_key: InstanceSetting::SINGLETON_KEY)
    instance_setting.update!(umbrella_project: ohd_project)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
