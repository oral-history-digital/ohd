class UpdateSegmentsTimecodeAndTapeNumber < ActiveRecord::Migration[5.2]
  def change
    #Segment.find_each do |segment|
      #tape, timecode = segment.timecode.split(' ')
      #segment.update_attributes tape_number: tape.gsub(/[\[\]]/, ''), timecode: timecode
      #binding.pry
    #end
  end
end
