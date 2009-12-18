class AddCreditsToInterview < ActiveRecord::Migration

  def self.up

    change_table :interviews do |t|
      t.string :interviewers
      t.string :transcriptors
      t.string :translators
      t.string :researchers
      t.string :proofreaders
      t.string :segmentators
    end

  end

  def self.down

    remove_column :interviews, :interviewers
    remove_column :interviews, :transcriptors
    remove_column :interviews, :translators
    remove_column :interviews, :researchers
    remove_column :interviews, :proofreaders
    remove_column :interviews, :segmentators

  end

end
