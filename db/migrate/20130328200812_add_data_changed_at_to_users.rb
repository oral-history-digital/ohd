class AddDataChangedAtToUsers < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    # register changes of user's personal data
    change_table :users do |t|
      t.datetime :data_changed_at
    end
    # add an indexed_at column to interviews
    change_table :interviews do |t|
      t.datetime :indexed_at
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :users, :data_changed_at
    remove_column :interviews, :indexed_at
  end
  end

end
