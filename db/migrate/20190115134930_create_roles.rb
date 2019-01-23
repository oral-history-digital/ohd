class CreateRoles < ActiveRecord::Migration[5.2]
  def change
    create_table :roles do |t|
      t.text :desc
      t.string :name

      t.timestamps
    end
  end
end
