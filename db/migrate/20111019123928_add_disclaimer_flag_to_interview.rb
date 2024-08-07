class AddDisclaimerFlagToInterview < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    change_table :interviews do |t|
      t.boolean :inferior_quality, :default => false  
    end
  end
  end

  def self.down
  unless Project.name.to_sym == :mog
    remove_column :interviews, :inferior_quality
  end
  end

end
