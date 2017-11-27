class CreateContributorsAndInterviewContribution < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog

    create_table :contributors do |t|
      t.string :first_name
      t.string :last_name
      t.boolean :interview, :default => false
      t.boolean :camera, :default => false
      t.boolean :transcription, :default => false
      t.boolean :translation, :default => false
      t.boolean :proofreading, :default => false
      t.boolean :segmentation, :default => false
      t.boolean :documentation, :default => false
      t.boolean :other, :default => false
    end

    create_table :contributions do |t|
      t.integer :interview_id
      t.integer :contributor_id
      t.string  :contribution_type
    end

    add_index :contributions, :interview_id

  end
  end

  def self.down
  unless Project.name.to_sym == :mog

    drop_table :contributors
    drop_table :contributions

  end
  end

end
