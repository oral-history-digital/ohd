class AddInterviewIdToSegments < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :eog

    change_table :segments do |t|
      t.integer :interview_id
    end
    add_index :segments, :interview_id

    say_with_time "Updating existing interviews & segments" do
      Segment.connection.execute "UPDATE segments, tapes SET segments.interview_id = tapes.interview_id WHERE segments.tape_id = tapes.id;"
    end

  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    remove_column :segments, :interview_id
  end
  end

end
