class UpcaseRefObjectTypeAndSource < ActiveRecord::Migration[5.2]
  def up
    execute "UPDATE metadata_fields SET source = CONCAT(UCASE(LEFT(source, 1)), SUBSTRING(source, 2));"
    execute "UPDATE metadata_fields SET ref_object_type = CONCAT(UCASE(LEFT(ref_object_type, 1)), SUBSTRING(ref_object_type, 2));"

    execute "UPDATE metadata_fields SET source = 'RegistryEntry' WHERE source = 'Registry_entry';"
    execute "UPDATE metadata_fields SET source = 'RegistryReferenceType' WHERE source = 'Registry_reference_type';"
  end

  def down
  end
end
