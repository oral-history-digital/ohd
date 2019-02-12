class CreateSearchFacets < ActiveRecord::Migration[5.2]
  def change
    create_table :search_facets do |t|
      t.string :name 
      t.boolean :use_as_facet
      t.string :facet_type
      t.integer :facet_id 
      t.integer :project_id

      t.timestamps
    end
  end
end
