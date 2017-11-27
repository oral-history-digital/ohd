class CreateUsers < ActiveRecord::Migration

  def self.up
  #unless Project.name.to_sym == :mog

    create_table :users do |t|
      t.string :first_name, :null => true
      t.string :last_name, :null => true
      t.string :appellation
      t.string :job_description
      t.string :research_intentions
      t.string :comments
      t.string :admin_comments
      t.string :organization
      t.string :homepage
      t.string :street
      t.string :zipcode
      t.string :city
      t.string :state
      t.string :country
      t.datetime :tos_agreed_at
      t.string :status
      t.datetime :processed_at
      t.timestamps
    end

    add_index :users, [ :first_name, :last_name ]
    add_index :users, :status

  #end
  end

  def self.down
  #unless Project.name.to_sym == :mog

    remove_table :users

  #end
  end

end
