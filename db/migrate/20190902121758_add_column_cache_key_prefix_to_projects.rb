class AddColumnCacheKeyPrefixToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :cache_key_prefix, :string, default: Project.first.shortname.downcase
  end
end
