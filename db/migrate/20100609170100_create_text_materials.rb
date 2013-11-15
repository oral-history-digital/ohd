class CreateTextMaterials < ActiveRecord::Migration
  def self.up
    create_table :text_materials do |t|
      t.references :interview
      t.string :document_type
      t.string :document_file_name
      t.string :document_content_type
      t.integer :document_file_size
    end
  end

  def self.down
    drop_table :text_materials
  end
end