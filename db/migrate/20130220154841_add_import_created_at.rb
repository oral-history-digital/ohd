class AddImportCreatedAt < ActiveRecord::Migration

  def self.up
    change_table :imports do |t|
      t.datetime :created_at
    end
  end

  def self.down
    remove_column :imports, :created_at
  end
  
end
