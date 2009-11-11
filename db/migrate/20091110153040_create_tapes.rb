class CreateTapes < ActiveRecord::Migration
  def self.up
    create_table :tapes do |t|
      t.references :interview
      t.string :media_id
      t.string :duration
      t.timestamps
    end
  end

  def self.down
    drop_table :tapes
  end
end
