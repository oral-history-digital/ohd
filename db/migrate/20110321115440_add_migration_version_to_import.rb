class AddMigrationVersionToImport < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog

    change_table :imports do |t|
      t.string :migration
    end

  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column :imports, :migration
  end
  end

end
