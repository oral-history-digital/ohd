class AddDurationAndTypeFlagToTape < ActiveRecord::Migration

  def self.up
  unless Project.name.to_sym == :mog
    add_column :tapes, :video, :boolean
    change_column :tapes, :duration, :integer

    # also change segment duration to int
    change_column :segments, :duration, :integer

    # add some more workflow-state flags to the interview
    add_column :interviews, :segmented, :boolean, default: false
    add_column :interviews, :researched, :boolean, default: false
    add_column :interviews, :proofread, :boolean, default: false

    puts "setting to segmented on existing interviews"
    #Interview.all(
        #:joins => 'RIGHT JOIN tapes on tapes.interview_id = interviews.id',
        #:readonly => false
    #).each do |interview|
    Interview.joins(:tapes).update_all(segmented: true)
    puts

  end
  end

  def self.down
  unless Project.name.to_sym == :mog
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

end
