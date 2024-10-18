require 'cyrillizer'

class MakeSegmentSpeakerAssociated < ActiveRecord::Migration[5.0]
  def up
    Project.where(shortname: 'za').first.interviews.find_each(batch_size: 1) do |interview|
      p "Processing interview #{interview.archive_id}"
      speakers_abbreviations = {}
      contributions = {}
      speakers = interview.contributors
      speakers.each do |speaker|
        unless speaker.first_name.blank? || speaker.last_name.blank?
          # map speaker ids to abbreviations
          speakers_abbreviations["#{speaker.first_name(:de)[0]}#{speaker.last_name(:de)[0]}"] = speaker.id
          speakers_abbreviations["#{speaker.first_name(:ru)[0]}#{speaker.last_name(:ru)[0]}"] = speaker.id
        end
      end

      interview.segments.group(:speaker).count.each do |speaker, count|
        if speaker.present?
          speaker_id = speakers_abbreviations[speaker] #if speaker_id.nil?
          speaker_id = speakers_abbreviations[speaker.reverse] if speaker_id.nil?
          unless speaker_id.nil?
            interview.segments.where(speaker: speaker).update_all speaker_id: speaker_id
          else
            p "Speaker not found: #{speaker}"
          end
        end
      end
    end
  end
  def down
    # do nothing
  end
end
