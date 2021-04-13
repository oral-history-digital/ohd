require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Interview do
  describe "transcript-upload" do
    it "should import transcript correctly" do
      interview = interview_with_contributions
      interview.create_or_update_segments_from_spreadsheet(File.join(Rails.root, 'spec', 'data', 'transcript_de.ods'), interview.tapes.first.id, 'de')
      expect(interview.segments.count).to eq(15)
      expect(interview.segments.first.translations.count).to eq(3)
      expect(interview.segments.first.text('de')).to eq("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann")
      expect(interview.segments.first.text('de-subtitle')).to eq("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann")
      expect(interview.segments.first.text('de-public')).to eq("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann")
      binding.pry
    end
  end
end
