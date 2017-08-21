require 'cyrillizer'

class MakeSegmentSpeakerAssociated < ActiveRecord::Migration[5.0]
  def change
  unless Project.name.to_sym == :eog
    #add_column :segments, :speaker_id, :integer

    Segment.find_each do |segment|
      #p "*** working: Segment #{segment.id} of Interview #{segment.interview.id}"

      problem = false

      # map speaker ids to abbreviations, and convert them to latin chars (to_lat)
      #
      speakers_abbreviations = {}
      speakers = segment.interview.interviewees + segment.interview.interview_contributors
      speakers.each do |speaker|
        speaker_abbreviation = (speaker.first_name[0] + speaker.last_name[0]).to_lat
        problem = true unless speakers_abbreviations[speaker_abbreviation].blank?
        speakers_abbreviations[speaker_abbreviation] = speaker.id
      end

      if problem
        p "*** Segment #{segment.id} of Interview #{segment.interview.id} seems to have ambigious abbreviations"
      else
        # associate speaker to segment
        speaker_id = speakers_abbreviations[segment.speaker.to_lat]
        if speaker_id.nil?
          #binding.pry
          p "*** Segment #{segment.id} of Interview #{segment.interview.id} has no speaker!!" 
        end
        segment.update_attributes speaker_id: speaker_id
      end
    end

    # interview translations is redundant information by now
    drop_table :interview_translations

  end
  end
end
