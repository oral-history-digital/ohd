namespace :repair do

  desc 'add a default tape to interviews that do not have at least one tape'
  task :add_default_tape => :environment do
    Interview.left_outer_joins(:tapes).where(tapes: {id: nil}).each do |i| 
      puts "creating tape for interview #{i.archive_id}"
      Tape.create interview_id: i.id, media_id: "#{i.archive_id.upcase}_01_01", workflow_state: "digitized", time_shift: 0, number: 1 
      i.touch
      puts "   ***   "
    end
  end

end
