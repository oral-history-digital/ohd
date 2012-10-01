class ExpandCitationTextColumns < ActiveRecord::Migration

  def self.up
    change_column :interviews, :original_citation, :text
    change_column :interviews, :translated_citation, :text
  end

  def self.down
    # do nothing, text column is compatible with string
  end
end
