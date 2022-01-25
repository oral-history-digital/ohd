class CreateInstitutionProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :institution_projects do |t|
      t.integer :institution_id
      t.integer :project_id

      t.timestamps
    end
  end
end
