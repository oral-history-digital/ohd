class CreateConsolidatedRegistry < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :eog
    # Start registry migration...
    create_table :registry_entries do |t|
      t.string :entry_code
      t.string :entry_desc
      t.string :latitude
      t.string :longitude
      t.string :workflow_state, :null => false
      t.boolean :list_priority
      t.timestamps
    end

    # NB: The following table supports the acts-as-graph schema.
    create_table :registry_hierarchies do |t|
      t.references :ancestor, :null => false
      t.references :descendant, :null => false
      t.boolean :direct, :null => false
      t.integer :count, :null => false
      t.timestamps
    end
    add_index :registry_hierarchies, :ancestor_id
    add_index :registry_hierarchies, :descendant_id
    add_index :registry_hierarchies, [:ancestor_id, :descendant_id], :unique => true

    create_table :registry_name_types do |t|
      t.string :code
      t.string :name
      t.integer :order_priority
      t.boolean :allows_multiple
      t.boolean :mandatory
    end

    create_table :registry_names do |t|
      t.references :registry_entry, :null => false
      t.references :registry_name_type, :null => false
      t.integer :name_position, :null => false
      t.timestamps
    end
    add_index :registry_names, [:registry_entry_id, :registry_name_type_id, :name_position], :unique => true, :name => 'registry_names_unique_types_and_positions'

    # Manually create the registry names translation table
    # to use UTF8 binary collation.
    # NB: This makes sure that registry 'das'/'daß' or
    # 'Andre'/'André' will actually be treated as distinct
    # entries!
    create_table :registry_name_translations,
                 :options => 'COLLATE utf8_bin' do |t|
      t.references :registry_name, :null => false
      t.string :locale, :null => false
      t.text :descriptor
      t.timestamps
    end
    add_index :registry_name_translations, :registry_name_id
    # Facilitate finding registry entries by name.
    add_index :registry_name_translations, :descriptor, :length => 255
    # Make sure that we have unique standard names.
    add_index :registry_name_translations, [:registry_name_id, :locale], :unique => true

    create_table :registry_reference_types do |t|
      t.references :registry_entry
      t.string :code
    end
    #RegistryReferenceType.create_translation_table! :name => :string

    create_table :registry_references do |t|
      t.references :registry_entry, :null => false
      t.references :ref_object, :null => false, :polymorphic => true
      t.references :registry_reference_type
      t.integer :ref_position, :null => false
      t.string :original_descriptor, :limit => 1000
      t.string :ref_details, :limit => 1000
      t.string :ref_comments, :limit => 1000
      t.string :ref_info, :limit => 1000
      t.string :workflow_state, :null => false
      t.references :interview, :null => false
      t.timestamps
    end

    create_table :languages do |t|
      t.string :code
    end

    add_column :interviews, :language_id, :integer

    drop_table :categorizations
    drop_table :category_translations
    drop_table :categories
  end
    Language.create_translation_table! :abbreviated => :string, :name => :string
  end

  def self.down
  unless Project.name.to_sym == :eog
    create_table :categories do |t|
      t.string :category_type
      t.string :code
    end
    create_table :category_translations do |t|
      t.references :category
      t.string :locale
      t.string :name
      t.timestamps
    end

    create_table :categorizations do |t|
      t.integer :category_id,   :null => false
      t.integer :interview_id,  :null => false
      t.string  :category_type
    end
    add_index :categorizations, [:category_type, :interview_id]

    remove_column :interviews, :language_id
    drop_table :languages
    Language.drop_translation_table!
    drop_table :registry_references
    RegistryReferenceType.drop_translation_table!
    drop_table :registry_reference_types
    RegistryName.drop_translation_table!
    drop_table :registry_names
    drop_table :registry_name_types
    drop_table :registry_hierarchies
    drop_table :registry_entries
  end
  end
end
