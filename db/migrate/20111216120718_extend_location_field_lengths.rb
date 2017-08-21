class ExtendLocationFieldLengths < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog
    change_column :interviews, :return_locations, :text
    change_column :interviews, :alias_names, :text
    change_column :interviews, :researchers, :text
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    change_column :interviews, :return_locations, :string
    change_column :interviews, :alias_names, :string
    change_column :interviews, :researchers, :string
  end
  end

end
