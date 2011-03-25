class AddMigrationVersionToImport < ActiveRecord::Migration

  def self.up

    change_table :imports do |t|
      t.string :migration
    end

  end

  def self.down
    remove_column :imports, :migration
  end

end
