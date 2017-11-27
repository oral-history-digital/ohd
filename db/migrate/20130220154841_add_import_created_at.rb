class AddImportCreatedAt < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    change_table :imports do |t|
      t.datetime :created_at
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column :imports, :created_at
  end
  end
  
end
