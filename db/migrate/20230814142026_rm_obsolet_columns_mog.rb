class RmObsoletColumnsMog < ActiveRecord::Migration[7.0]
  def up
    drop_table :histories
    drop_table :history_translations

    if Project.first.shortname.to_sym == :mog
      remove_column :interviews, :lang
      remove_column :interviews, :photos
      remove_column :photo_translations, :photo_dedalo_id
      remove_column :users, :failed_attempts
      remove_column :users, :authentication_token
      remove_column :users, :locked_at
      remove_column :users, :unlock_token
    end
  end
  def down
  end
end
