class AddProjectIdToCollections < ActiveRecord::Migration

  def self.up

    change_table :collections do |t|
      t.string :project_id
    end

  end

  def self.down

    remove_column :collections, :project_id

  end

end
