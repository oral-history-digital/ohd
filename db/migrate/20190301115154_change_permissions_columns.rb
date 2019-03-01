class ChangePermissionsColumns < ActiveRecord::Migration[5.2]
  def change
    rename_column :permissions, :controller, :klass
    rename_column :permissions, :action, :action_name

    Permission.all.each do |permission|
      permission.update_attribute :klass, permission.klass.classify
    end
  end
end
