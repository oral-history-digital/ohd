class ExtendLocationFieldLengths < ActiveRecord::Migration

  def self.up
    change_column :interviews, :return_locations, :text
    change_column :interviews, :alias_names, :text
    change_column :interviews, :researchers, :text
  end

  def self.down
    change_column :interviews, :return_locations, :string
    change_column :interviews, :alias_names, :string
    change_column :interviews, :researchers, :string
  end

end
