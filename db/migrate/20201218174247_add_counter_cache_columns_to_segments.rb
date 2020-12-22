class AddCounterCacheColumnsToSegments < ActiveRecord::Migration[5.2]
  def change
    add_column :segments, :registry_references_count, :integer, default: 0
    add_column :segments, :annotations_count, :integer, default: 0
    add_column :segments, :has_heading, :boolean, default: false

    sql = ''

    RegistryReference.where(ref_object_type: 'Segment').group(:ref_object_id).count.each do |segment_id, count|
      sql << "UPDATE segments SET registry_references_count = #{count} WHERE id = #{segment_id};"
    end

    Annotation.group(:segment_id).count.each do |segment_id, count|
      sql << "UPDATE segments SET annotations_count = #{count} WHERE id = #{segment_id};"
    end

    execute sql

    # Hack for mysql2 adapter to be able query again after executing multistatement_query
    connection.raw_connection.store_result while connection.raw_connection.next_result

    Segment.with_heading.update_all(has_heading: true)
  end

  def down
    remove_column :segments, :registry_references_count
    remove_column :segments, :annotations_count
    remove_column :segments, :has_heading
  end
end
