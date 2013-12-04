class ExtendUserContentDescription < ActiveRecord::Migration

  # change user_contents.description to utilize a larger character limit
  def self.up
    change_column :user_contents, :description, :string, :limit => 300
  end

  def self.down
    # there is no identical rollback, since reducing column size will raise errors
    # without content adjustments - functionally it is the same even with larger limits
  end
end
