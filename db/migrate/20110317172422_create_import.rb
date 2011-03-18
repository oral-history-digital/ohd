class CreateImport < ActiveRecord::Migration

  def self.up

    create_table :imports do |t|
      t.integer :importable_id
      t.string  :importable_type
      t.datetime :time
    end
    add_index :imports, [:importable_id, :importable_type]

  end

  def self.down

    drop_table :imports

  end

end
