class RemoveUnusedData < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    drop_table :home_locations
    drop_table :languages
    remove_column :interviews, :language_id
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    create_table :home_locations do |t|
      t.string :name, :null => false
    end

    create_table :languages do |t|
      t.string :name, :null => false
    end

    add_column :interviews, :language_id, :integer
  end
  end
end
