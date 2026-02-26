class CreateWebauthnCredentials < ActiveRecord::Migration[8.0]
  def change
    create_table :webauthn_credentials do |t|
      t.integer :user_id, null: false
      t.string :external_id, null: false
      t.string :public_key, null: false
      t.string :nickname
      t.bigint :sign_count, null: false, default: 0
      
      t.timestamps
    end
    
    add_index :webauthn_credentials, :external_id, unique: true
  end
end
