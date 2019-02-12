class CreateProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :projects do |t|
      

      t.timestamps
    end

    add_column :inteviews, :project_id, :integer
  end
end
