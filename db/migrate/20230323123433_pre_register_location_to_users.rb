class PreRegisterLocationToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :pre_register_location, :string
  end
end
