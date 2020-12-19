class AddCounterCacheColumnsToInterviewsAndPeople < ActiveRecord::Migration[5.2]
  def change
    #
    # the sense of this migration is to prevent failures in the polymorphic counter_cache on registry_references
    #
    add_column :interviews, :registry_references_count, :integer, default: 0
    add_column :people, :registry_references_count, :integer, default: 0

    sql = ''

    RegistryReference.where(ref_object_type: 'Interview').group(:ref_object_id).count.each do |interview_id, count|
      sql << "UPDATE interviews SET registry_references_count = #{count} WHERE id = #{interview_id};"
    end

    RegistryReference.where(ref_object_type: 'Person').group(:ref_object_id).count.each do |person_id, count|
      sql << "UPDATE people SET registry_references_count = #{count} WHERE id = #{person_id};"
    end

    execute sql

    # Hack for mysql2 adapter to be able query again after executing multistatement_query
    connection.raw_connection.store_result while connection.raw_connection.next_result
  end
end
