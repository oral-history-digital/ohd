class AddDefaultSearchOrderToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :default_search_order, :integer, default: 0,
      null: false
  end
end
