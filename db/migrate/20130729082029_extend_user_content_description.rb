class ExtendUserContentDescription < ActiveRecord::Migration

  # change user_contents.description to utilize a larger character limit
  def self.up
  #unless Project.name.to_sym == :mog
    change_column :user_contents, :description, :string, :limit => 300
  #end
  end

  def self.down
  unless Project.name.to_sym == :mog
    # there is no identical rollback, since reducing column size will raise errors
    # without content adjustments - functionally it is the same even with larger limits
  end
  end
end
