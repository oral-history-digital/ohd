class CreateInterviews < ActiveRecord::Migration
  def self.up
    create_table :interviews do |t|
      t.string :archive_id
      t.references :collection
      t.string :full_title
      t.boolean :gender
      t.string :date_of_birth
      t.string :country_of_origin
      t.boolean :video
      t.integer :duration
      t.boolean :translated
      t.string :forced_labor_location
      t.string :details_of_origin
      t.string :deportation_date
      t.string :deportation_location
      t.string :forced_labor_details
      t.string :punishment
      t.string :liberation_date
      t.references :language
      t.references :home_location
      t.timestamps
    end

    create_table :forced_labor_groups do |t|
      t.string :name
    end

    create_table :interview_forced_labor_groups do |t|
      t.references :interview, :null => false
      t.references :forced_labor_group, :null => false
    end

    create_table :forced_labor_habitations do |t|
      t.string :name
    end

    create_table :interview_forced_labor_habitations do |t|
      t.references :interview, :null => false
      t.references :forced_labor_habitation, :null => false
    end

    create_table :forced_labor_fields do |t|
      t.string :name
    end

    create_table :interview_forced_labor_fields do |t|
      t.references :interview, :null => false
      t.references :forced_labor_field, :null => false
    end

    create_table :languages do |t|
      t.string :name, :null => false
    end

    create_table :home_locations do |t|
      t.string :name
    end
  end

  def self.down
    drop_table :interviews
    drop_table :forced_labor_groups
    drop_table :interview_forced_labor_groups
    drop_table :forced_labor_habitations
    drop_table :interview_forced_labor_habitations
    drop_table :forced_labor_fields
    drop_table :interview_forced_labor_fields
    drop_table :languages
    drop_table :home_locations
  end
end
