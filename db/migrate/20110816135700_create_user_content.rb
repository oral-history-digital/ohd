class CreateUserContent < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    create_table :user_contents do |t|
      t.integer :user_id
      t.string :id_hash
      t.string :title
      t.string :description
      t.string :interview_references
      t.string :properties, :limit => 500
      t.string :link_url
      t.string :type, :null => false
      t.boolean :shared, :default => false
      t.boolean :persistent
      t.timestamps
    end
    add_index :user_contents, :user_id
    add_index :user_contents, [:type, :id_hash]

  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    drop_table :user_contents
  end
  end

end
