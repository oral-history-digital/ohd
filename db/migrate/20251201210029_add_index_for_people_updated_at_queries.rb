class AddIndexForPeopleUpdatedAtQueries < ActiveRecord::Migration[8.0]
  def change
    # Add composite index on (project_id, updated_at) for faster MAX queries
    # This will speed up queries like:
    # SELECT MAX(`people`.`updated_at`) FROM `people` WHERE `people`.`project_id` = ?
    add_index :people, [:project_id, :updated_at],
      name: 'index_people_on_project_and_updated_at'
    
    # Also add for interviews if it doesn't exist
    unless index_exists?(:interviews, [:project_id, :updated_at])
      add_index :interviews, [:project_id, :updated_at],
        name: 'index_interviews_on_project_and_updated_at'
    end
  end
end
