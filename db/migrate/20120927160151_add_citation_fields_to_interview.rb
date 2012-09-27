class AddCitationFieldsToInterview < ActiveRecord::Migration

  def self.up
    change_table :interviews do |t|
      t.string :original_citation
      t.string :translated_citation
      t.string :citation_media_id
      t.string :citation_timecode, :limit => 18
    end
  end

  def self.down
    change_table :interviews do |t|
      t.remove :original_citation
      t.remove :translated_citation
      t.remove :citation_media_id
      t.remove :citation_timecode
    end
  end

end
