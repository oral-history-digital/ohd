class AddMigrationVersionToImport < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    change_table :imports do |t|
      t.string :migration
    end

  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :imports, :migration
  end
  end

end
