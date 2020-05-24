class AddPropertiesToPeople < ActiveRecord::Migration[5.2]
  def change
    add_column :people, :properties, :string
  end
end
