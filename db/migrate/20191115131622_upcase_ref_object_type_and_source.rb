class UpcaseRefObjectTypeAndSource < ActiveRecord::Migration[5.2]
  def change
    execute "UPDATE metadata_fields SET source = CONCAT(UCASE(LEFT(source, 1)), SUBSTRING(source, 2));"
    execute "UPDATE metadata_fields SET ref_object_type = CONCAT(UCASE(LEFT(ref_object_type, 1)), SUBSTRING(ref_object_type, 2));"
  end
end
