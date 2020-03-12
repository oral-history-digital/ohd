class WriteArchiveIdToRegistryReferences < ActiveRecord::Migration[5.2]
  def change
    add_column :registry_references, :archive_id, :string
    Interview.all.each{|i| i.registry_references.update_all(archive_id: i.archive_id)}
    Interview.all.each{|i| i.segment_registry_references.update_all(archive_id: i.archive_id)}
    Person.all.each{|i| i.interviews.first && i.registry_references.update_all(archive_id: i.interviews.first.archive_id)}
  end
end
