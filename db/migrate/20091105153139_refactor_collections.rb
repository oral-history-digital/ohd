class RefactorCollections < ActiveRecord::Migration
  def self.up
  #unless Project.name.to_sym == :eog
    change_column(:collections, :notes, :text)
    change_column(:collections, :interviewers, :text)
    add_column(:collections, :homepage, :string)
  #end
  end

  def self.down
  #unless Project.name.to_sym == :eog
    change_column(:collections, :notes, :string)
    change_column(:collections, :interviewers, :string)
    remove_column(:collections, :homepage)
  #end
  end
end
