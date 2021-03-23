class UpdateDgArchiveIds < ActiveRecord::Migration[5.2]
  def up
    if Project.current.identifier.to_sym == :dg
      Project.current.update_attributes archive_id_number_length: 4, cache_key_prefix: "adg", shortname: "ADG", initials: "adg" 
      execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'dg', 'adg0');"
      execute "UPDATE segments SET archive_id = REPLACE(archive_id, 'dg', 'adg0');"
      execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'dg', 'adg0');"
    end
  end

  def down
    if Project.current.identifier.to_sym == :dg
      Project.current.update_attributes archive_id_number_length: 3, cache_key_prefix: "dg", shortname: "DG", initials: "dg" 
      execute "UPDATE interviews SET archive_id = REPLACE(archive_id, 'adg0', 'dg');"
      execute "UPDATE segments SET archive_id = REPLACE(archive_id, 'adg0', 'dg');"
      execute "UPDATE registry_references SET archive_id = REPLACE(archive_id, 'adg0', 'dg');"
    end
  end
end
