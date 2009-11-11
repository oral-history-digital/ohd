class RefactorCollections < ActiveRecord::Migration
  def self.up
    change_column(:collections, :notes, :text)
    change_column(:collections, :interviewers, :text)
    add_column(:collections, :homepage, :string)
  end

  def self.down
    change_column(:collections, :notes, :string)
    change_column(:collections, :interviewers, :string)
    remove_column(:collections, :homepage)
  end
end
