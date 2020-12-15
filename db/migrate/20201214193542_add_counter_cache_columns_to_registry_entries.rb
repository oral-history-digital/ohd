class AddCounterCacheColumnsToRegistryEntries < ActiveRecord::Migration[5.2]
  def up
    add_column :registry_entries, :registry_references_count, :integer, default: 0
    add_column :registry_entries, :children_count, :integer, default: 0
    add_column :registry_entries, :parents_count, :integer, default: 0

    sql = ''

    RegistryReference.group(:registry_entry_id).count.each do |registry_entry_id, count|
      #RegistryEntry.find(registry_entry_id).update_attributes(registry_references_count: count)
      sql << "UPDATE registry_entries SET registry_references_count = #{count} WHERE id = #{registry_entry_id};"
    end

    RegistryHierarchy.group(:ancestor_id).count.each do |registry_entry_id, count|
      #RegistryEntry.find(registry_entry_id).update_attributes(children_count: count)
      sql << "UPDATE registry_entries SET children_count = #{count} WHERE id = #{registry_entry_id};"
    end

    RegistryHierarchy.group(:descendant_id).count.each do |registry_entry_id, count|
      #RegistryEntry.find(registry_entry_id).update_attributes(parents_count: count)
      sql << "UPDATE registry_entries SET parents_count = #{count} WHERE id = #{registry_entry_id};"
    end

    execute sql

    # Hack for mysql2 adapter to be able query again after executing multistatement_query
    #connection.raw_connection.store_result while connection.raw_connection.next_result
  end

  def down
    remove_column :registry_entries, :registry_references_count
    remove_column :registry_entries, :children_count
    remove_column :registry_entries, :parents_count
  end
end
