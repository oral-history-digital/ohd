require "test_helper"

class InterviewTest < ActiveSupport::TestCase
  def setup
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1, false)
    #@interview.segments.destroy_all
  end

  def interview
    @interview
  end

  test "should import ods-transcript correctly" do
    interview.create_or_update_segments_from_spreadsheet(File.join(Rails.root, 'test', 'files', 'transcript_de.ods'), interview.tapes.first.id, 'de', false)
    assert_equal(15, interview.segments.count)
    #assert_equal(3, interview.segments.first.translations.count)
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('de'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('de-subtitle'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('de-public'))
  end

  test "should import csv-transcript correctly" do
    interview.create_or_update_segments_from_spreadsheet(File.join(Rails.root, 'test', 'files', 'transcript_de.csv'), interview.tapes.first.id, 'de', false)
    assert_equal(15, interview.segments.count)
    #assert_equal(3, interview.segments.first.translations.count)
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('de'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('de-subtitle'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('de-public'))
  end

  test "should import vtt-transcript correctly" do
    interview.create_or_update_segments_from_vtt(File.join(Rails.root, 'test', 'files', 'transcript_de.vtt'), interview.tapes.first.id, 'de')
    assert_equal(14, interview.segments.count)
    #assert_equal(3, interview.segments.first.translations.count)
    assert_equal("Victor, kannst Du uns kurz so erklären, wie die Firmen jetzt in der Villa strukturiert sind und warum das vor allem so geworden ist, warum die Aktiengesellschaften <[?]> .", interview.segments.first.text('de'))
    assert_equal("Victor, kannst Du uns kurz so erklären, wie die Firmen jetzt in der Villa strukturiert sind und warum das vor allem so geworden ist, warum die Aktiengesellschaften <>.", interview.segments.first.text('de-subtitle'))
    assert_equal("Victor, kannst Du uns kurz so erklären, wie die Firmen jetzt in der Villa strukturiert sind und warum das vor allem so geworden ist, warum die Aktiengesellschaften <[?]>.", interview.segments.first.text('de-public'))
  end

end
