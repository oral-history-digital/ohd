class CreateMetadataFields < ActiveRecord::Migration[5.2]
  def change
    #drop_table :metadata_fields
    #drop_table :metadata_field_translations
    create_table :metadata_fields do |t|
      t.integer :project_id
      t.string :name 
      t.boolean :use_as_facet
      t.boolean :use_in_results_table
      t.boolean :use_in_details_view
      t.boolean :display_on_landing_page
      t.string :ref_object_type
      t.string :source
      t.string :label
      t.string :values

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        MetadataField.create_translation_table! label: :string

        YAML::load_file('config/project.yml')['default']['person_properties'].each do |hash|
          labels = hash.delete('label')
          metadatum = MetadataField.create hash
          labels.each do |locale, label|
            metadatum.update_attributes locale: locale, label: label
          end if labels
        end
      end

      dir.down do
        MetadataField.drop_translation_table!
      end
    end

  end
end
