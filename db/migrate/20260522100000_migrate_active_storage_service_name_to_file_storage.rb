class MigrateActiveStorageServiceNameToFileStorage < ActiveRecord::Migration[8.0]
  OLD_SERVICE_NAME = 'fu_server'.freeze
  NEW_SERVICE_NAME = 'file_storage'.freeze

  def up
    return unless table_exists?(:active_storage_blobs)

    ActiveStorage::Blob.unscoped
      .where(service_name: OLD_SERVICE_NAME)
      .update_all(service_name: NEW_SERVICE_NAME)
  end

  def down
    return unless table_exists?(:active_storage_blobs)

    ActiveStorage::Blob.unscoped
      .where(service_name: NEW_SERVICE_NAME)
      .update_all(service_name: OLD_SERVICE_NAME)
  end
end
