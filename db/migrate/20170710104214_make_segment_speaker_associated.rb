require 'cyrillizer'

class MakeSegmentSpeakerAssociated < ActiveRecord::Migration[5.0]
  def change
    unless Project.name.to_sym == :mog
      add_column :segments, :speaker_id, :integer

      Interview.all.each do |interview|
        speakers_abbreviations = {}
        contributions = {}
        speakers = interview.interviewees + interview.interview_contributors
        speakers.each do |speaker|
          unless speaker.first_name.blank? || speaker.last_name.blank?
            # map speaker ids to abbreviations, and convert them to latin chars (to_lat)
            speakers_abbreviations[(speaker.first_name[0] + speaker.last_name[0]).to_lat] = speaker.id
          end
        end

        interview.segments.each do |segment|
          # associate speaker to segment
          speaker_id = speakers_abbreviations[segment.speaker.to_lat] 
          speaker_id = speakers_abbreviations[segment.speaker.reverse.to_lat]  if speaker_id.nil?
          if speaker_id.nil?
            interview.contributions.each do |contribution|
              if segment.speaker.to_lat.downcase.match(/^#{contribution.contribution_type}/)
                speaker_id = contribution.person_id
              end
            end
          end
          if speaker_id.nil?
            binding.pry
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
