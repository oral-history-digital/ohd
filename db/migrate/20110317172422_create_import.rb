class CreateImport < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    create_table :imports do |t|
      t.integer :importable_id
      t.string  :importable_type
      t.datetime :time
    end
    add_index :imports, [:importable_id, :importable_type]

  end
  end

  def self.down
  unless Project.name.to_sym == :eog

    drop_table :imports

  end
  end

end
