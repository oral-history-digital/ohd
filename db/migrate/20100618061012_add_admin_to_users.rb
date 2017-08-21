class AddAdminToUsers < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :eog
    add_column :users, :admin, :boolean
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :users, :admin
  end
  end
end
