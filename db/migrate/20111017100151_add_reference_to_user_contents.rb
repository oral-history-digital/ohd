class AddReferenceToUserContents < ActiveRecord::Migration

  def self.up
  #unless Project.name.to_sym == :eog
    change_table :user_contents do |t|
      t.integer :reference_id
      t.string :reference_type
    end
  #end
  end

  def self.down
  #unless Project.name.to_sym == :eog
    remove_columns :user_contents, :reference_id, :reference_type
  #end
  end

end
