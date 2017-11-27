class CreateLocationReferences < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog

    create_table :location_references do |t|
      t.references :interview
      t.string :name
      t.string :alias_names
      t.string :location_name
      t.string :alias_location_names
      t.string :longitude
      t.string :latitude
      t.string :location_type # Ortsnennung, AEL, KZ, Firma, ...
      t.string :description
      t.string :reference_type # Geburtsort, Ort d. Deportation...
    end

    add_index :location_references, :interview_id

  end
  end

  def self.down
  unless Project.name.to_sym == :mog

    drop_table :location_references

  end
  end

end
