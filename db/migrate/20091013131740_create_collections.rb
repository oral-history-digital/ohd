class CreateCollections < ActiveRecord::Migration
  def self.up
  #unless Project.name.to_sym == :mog
    create_table :collections do |t|
      t.string :name
      t.string :countries
      t.string :institution
      t.string :responsibles
      t.string :notes
      t.string :interviewers

      t.timestamps
    end
  #end
  end

  def self.down
  #unless Project.name.to_sym == :mog
    drop_table :collections
  #end
  end
end
