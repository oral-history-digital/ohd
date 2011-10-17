class AddReferenceToUserContents < ActiveRecord::Migration

  def self.up
    change_table :user_contents do |t|
      t.integer :reference_id
      t.string :reference_type
    end
  end

  def self.down
    remove_columns :user_contents, :reference_id, :reference_type
  end

end
