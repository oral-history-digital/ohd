# Maximum length of index keys used to be 767 bytes. With UTF8MB4 (4 bytes / char)
# this means 191 characters, max. Therefore, trying to create an index on a varchar(255)
# results in an error message along the lines of
#
#   Mysql2::Error: Specified key was too long; max key length is 767 bytes
#
# Note that the maximum index key length was raised in later versions of MySQL/MariaDB.
# Therefore, this error cannot necessarily be reproduced everywhere.
#
# The fix is to limit the index prefix to 191 characters where applicable.
#
# This migration applies the suggested fix by dropping and recreating all
# respective indices.
class FixIndexPrefixLengthOfUtf8mb4Columns < ActiveRecord::Migration[5.2]
  def up
    remove_index :active_storage_attachments, [:record_type, :record_id, :name, :blob_id]
    add_index :active_storage_attachments, ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true, length: {record_type: 191, name: 191}

    remove_index :active_storage_blobs, :key
    add_index :active_storage_blobs, :key, name: "index_active_storage_blobs_on_key", unique: true, length: 191

    remove_index :registry_name_translations, [:registry_name_id, :locale]
    add_index :registry_name_translations, [:registry_name_id, :locale], name: "index_registry_name_translations_on_registry_name_id_and_locale", unique: true, length: {locale: 191}

    remove_index :text_materials, [:interview_id, :document_type, :locale]
    add_index :text_materials, [:interview_id, :document_type, :locale], name: "index_text_materials_unique_document",
              unique: true, length: {document_type: 191}
  end

  def down
    remove_index :active_storage_attachments, [:record_type, :record_id, :name, :blob_id]
    add_index :active_storage_attachments, ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true

    remove_index :active_storage_blobs, :key
    add_index :active_storage_blobs, :key, name: "index_active_storage_blobs_on_key", unique: true

    remove_index :registry_name_translations, [:registry_name_id, :locale]
    add_index :registry_name_translations, [:registry_name_id, :locale], name: "index_registry_name_translations_on_registry_name_id_and_locale", unique: true

    remove_index :text_materials, [:interview_id, :document_type, :locale]
    add_index :text_materials, [:interview_id, :document_type, :locale], name: "index_text_materials_unique_document",
              unique: true
  end
end
