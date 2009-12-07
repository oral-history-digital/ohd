class AddDurationAndTypeFlagToTape < ActiveRecord::Migration

  def self.up

    # remove old string-format duration (was nil, anyway)
    remove_column :tapes, :duration

    change_table :tapes do |t|
      t.boolean :video
      t.integer :duration
    end

    # also change segment duration to int
    remove_column :segments, :duration
    add_column :segments, :duration, :integer

    # add some more workflow-state flags to the interview
    change_table :interviews do |t|
      t.boolean :segmented, :default => false
      t.boolean :researched, :default => false
      t.boolean :proofread, :default => false
    end


    puts "setting to segmented on existing interviews"
    Interview.find( :all,
                      :joins => 'RIGHT JOIN tapes on tapes.interview_id = interviews.id',
                      :readonly => false).each do |interview|
      interview.update_attribute :segmented, true
      STDOUT::printf '.'
      STDOUT.flush
    end
    puts

  end

  def self.down

    remove_column :tapes, :video
    remove_column :tapes, :duration
    remove_column :segments, :duration

    add_column :tapes, :duration, :string
    add_column :segments, :duration, :string

    remove_column :interviews, :segmented
    remove_column :interviews, :researched
    remove_column :interviews, :proofread
    
  end

end
