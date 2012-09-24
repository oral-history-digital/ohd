class CreateAnnotations < ActiveRecord::Migration

  def self.up
    create_table :annotations do |t|
      t.references :interview
      t.string :author
      t.string :media_id, :null => false
      t.text :text, :null => false
      t.string :timecode, :null => false
      t.timestamps
    end
    add_index :annotations, :interview_id
  end

  def self.down
    drop_table :annotations
  end

end
