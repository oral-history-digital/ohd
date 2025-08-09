class CreateUserProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :user_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :known_language, null: true, foreign_key: { to_table: :languages }
      t.references :unknown_language, null: true, foreign_key: { to_table: :languages }
      
      t.timestamps
    end
    
    add_index :user_profiles, :user_id, unique: true
  end
end