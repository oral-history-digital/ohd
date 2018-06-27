class AddProjectIdToCollections < ActiveRecord::Migration

  def self.up
  #unless Project.name.to_sym == :mog

    change_table :collections do |t|
      t.string :project_id
    end

  #end
  end

  def self.down
  #unless Project.name.to_sym == :mog

    remove_column :collections, :project_id

  #end
  end

end
