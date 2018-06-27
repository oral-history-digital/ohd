class ExpandCitationTextColumns < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    change_column :interviews, :original_citation, :text
    change_column :interviews, :translated_citation, :text
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    # do nothing, text column is compatible with string
  end
  end
end
