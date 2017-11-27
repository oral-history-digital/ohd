class CreateTapes < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    create_table :tapes do |t|
      t.references :interview
      t.string :media_id, :null => :false
      t.string :duration, :null => :false
      t.timestamps
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    drop_table :tapes
  end
  end
end
