class CreateAccessConfigs < ActiveRecord::Migration[7.0]
  def change
    create_table :access_configs do |t|
      t.references :project, null: false, foreign_key: true
      t.text :organization
      t.text :job_description
      t.text :research_intentions
      t.text :specification
      t.text :tos_agreement

      t.timestamps
    end

    Project.all.each do |project|
      project.create_access_config!
    end
  end
end
