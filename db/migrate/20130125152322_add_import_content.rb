class AddImportContent < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    change_table :imports do |t|
      t.string :content, :limit => 400
    end
    add_index :location_references, [:interview_id, :name]
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :imports, :content
    remove_index :location_references, :column => [:interview_id, :name]
  end
  end

end
