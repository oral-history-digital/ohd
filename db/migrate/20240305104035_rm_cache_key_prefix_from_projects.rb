class RmCacheKeyPrefixFromProjects < ActiveRecord::Migration[7.0]
  def change
    remove_column :projects, :cache_key_prefix
  end
end
