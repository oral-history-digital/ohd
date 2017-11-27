class AddDataChangedAtToUsers < ActiveRecord::Migration

  def self.up
    # register changes of user's personal data
    change_table :users do |t|
      t.datetime :data_changed_at
    end
    # add an indexed_at column to interviews
  unless Project.name.to_sym == :mog
    change_table :interviews do |t|
      t.datetime :indexed_at
    end
  end
  end

  def self.down
    remove_column :users, :data_changed_at
  unless Project.name.to_sym == :mog
    remove_column :interviews, :indexed_at
  end
  end

end
