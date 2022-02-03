class CreateInstitutions < ActiveRecord::Migration[5.2]
  def change
    create_table :institutions do |t|
      t.string :name
      t.string :shortname
      t.text :description
      t.string :street
      t.string :zip
      t.string :city
      t.string :country
      t.float :latitude
      t.float :longitude
      t.string :isil
      t.string :gnd
      t.string :website
      t.integer :parent_id

      t.timestamps
    end
  end
end
