class ChangeDefaultSearchOrderDefault < ActiveRecord::Migration[7.0]
  def change
    change_column_default :projects, :default_search_order, from: 0, to: 1
  end
end
