class AddLocaleToTextMaterials < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :mog
    add_column :text_materials, :locale, :string, :limit => 5, :default => 'de', :null => false
    add_index :text_materials, [:interview_id, :document_type, :locale], :name => 'index_text_materials_unique_document', :unique => true
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_index :text_materials, :name => 'index_text_materials_unique_document'
    remove_column :text_materials, :locale
  end
  end
end
