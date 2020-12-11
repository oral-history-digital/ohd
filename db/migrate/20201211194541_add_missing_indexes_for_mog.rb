class AddMissingIndexesForMog < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      add_index :annotation_translations, :annotation_id
      add_index :annotations, :interview_id
      add_index :annotations, :segment_id
      add_index :contributions, :interview_id
      add_index :history_translations, :history_id
      add_index :history_translations, :locale
      add_index :person_translations, :locale
      add_index :photo_translations, :photo_id
      add_index :registry_hierarchies, :descendant_id
      add_index :registry_name_translations, [:registry_name_id, :locale]
      add_index :registry_reference_types, :code
      add_index :registry_reference_type_translations, :registry_reference_type_id, name: 'reg_ref_type_id'
      add_index :user_registrations, :email
      add_index :user_registrations, :workflow_state
      add_index :user_registrations, [:workflow_state, :email]
      add_index :user_accounts, :confirmation_token
      add_index :user_accounts, :reset_password_token
    end
  end
end
