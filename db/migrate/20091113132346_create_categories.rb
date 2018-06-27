class CreateCategories < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog

    create_table :categories do |t|
      t.string  :name
      t.string :category_type
    end
    add_index :categories, :name

    create_table :categorizations do |t|
      t.integer :category_id, :null => false
      t.integer :interview_id, :null => false
      t.string :category_type
    end
    add_index :categorizations, [ :category_type, :interview_id ]

    drop_table :interview_forced_labor_groups
    drop_table :interview_forced_labor_fields
    drop_table :interview_forced_labor_habitations
    drop_table :forced_labor_groups
    drop_table :forced_labor_fields
    drop_table :forced_labor_habitations

  end
  end
  

  def self.down
  unless Project.name.to_sym == :mog

    drop_table :categories

    drop_table :categorizations

  end
  end
  
end
