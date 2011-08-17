class CreateUserContent < ActiveRecord::Migration

  def self.up
    create_table :user_contents do |t|
      t.integer :user_id
      t.string :title
      t.string :description
      t.string :interview_references
      t.string :properties, :limit => 500
      t.string :type, :null => false
      t.boolean :shared, :default => false
      t.timestamps
    end
    add_index :user_contents, :type

  end

  def self.down
    drop_table :user_contents
  end

end
