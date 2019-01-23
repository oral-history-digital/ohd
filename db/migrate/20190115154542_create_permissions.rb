class CreatePermissions < ActiveRecord::Migration[5.2]
  def change
    create_table :permissions do |t|
      t.string :controller
      t.string :action
      t.text :desc

      t.timestamps
    end
  end
end
