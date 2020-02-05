class WriteArchiveIdToRegistryReferences < ActiveRecord::Migration[5.2]
  def change
    add_column :registry_references, :archive_id, :string
    RegistryReference.where(archive_id: nil).find_each do |rr|
      if rr.ref_object_type == "Interview"
        rr.update_attributes archive_id: Interview.find(rr.ref_object_id).archive_id
      elsif rr.ref_object_type == "Person"
        begin
          rr.update_attributes archive_id: Person.find(rr.ref_object_id).interviews.first.archive_id
        rescue
          nil
        end
      end
    end
  end
end
