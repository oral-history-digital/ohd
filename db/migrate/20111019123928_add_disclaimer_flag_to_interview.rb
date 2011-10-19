class AddDisclaimerFlagToInterview < ActiveRecord::Migration

  def self.up
    change_table :interviews do |t|
      t.boolean :inferior_quality, :default => false  
    end
  end

  def self.down
    remove_column :interviews, :inferior_quality
  end

end
