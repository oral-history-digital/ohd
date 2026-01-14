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
    interview.create_or_update_segments_from_spreadsheet(File.join(Rails.root, 'test', 'files', 'transcript_de.ods'), interview.tapes.first.id, 'ger', false)
    assert_equal(15, interview.segments.count)
    #assert_equal(3, interview.segments.first.translations.count)
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('ger'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('ger-subtitle'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('ger-public'))
  end

  test "should import csv-transcript correctly" do
    interview.create_or_update_segments_from_spreadsheet(File.join(Rails.root, 'test', 'files', 'transcript_de.csv'), interview.tapes.first.id, 'ger', false)
    assert_equal(15, interview.segments.count)
    #assert_equal(3, interview.segments.first.translations.count)
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('ger'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('ger-subtitle'))
    assert_equal("Heute ist Montag der 5. Oktober 2020, ich führe ein Interview mit Frau Alma Brückmann", interview.segments.first.text('ger-public'))
  end

  test "should import vtt-transcript correctly" do
    interview.create_or_update_segments_from_vtt(File.join(Rails.root, 'test', 'files', 'transcript_de.vtt'), interview.tapes.first.id, 'ger')
    assert_equal(14, interview.segments.count)
    #assert_equal(3, interview.segments.first.translations.count)
    assert_equal("Victor, kannst Du uns kurz so erklären, wie die Firmen jetzt in der Villa strukturiert sind und warum das vor allem so geworden ist, warum die Aktiengesellschaften <[?]> .", interview.segments.first.text('ger'))
    assert_equal("Victor, kannst Du uns kurz so erklären, wie die Firmen jetzt in der Villa strukturiert sind und warum das vor allem so geworden ist, warum die Aktiengesellschaften <[?]>.", interview.segments.first.text('ger-subtitle'))
    assert_equal("Victor, kannst Du uns kurz so erklären, wie die Firmen jetzt in der Villa strukturiert sind und warum das vor allem so geworden ist, warum die Aktiengesellschaften <[?]>.", interview.segments.first.text('ger-public'))
  end

  test "tasks_user_ids returns unique user IDs" do
    # If interview has tasks, should return unique user IDs
    if interview.tasks.any?
      user_ids = interview.tasks_user_ids
      assert user_ids.is_a?(Array), "Should return an array"
      assert_equal user_ids, user_ids.uniq, "Should return unique IDs"
    else
      skip "No tasks available for testing"
    end
  end

  test "tasks_supervisor_ids returns unique supervisor IDs" do
    # If interview has tasks, should return unique supervisor IDs
    if interview.tasks.any?
      supervisor_ids = interview.tasks_supervisor_ids
      assert supervisor_ids.is_a?(Array), "Should return an array"
      assert_equal supervisor_ids, supervisor_ids.uniq, "Should return unique IDs"
    else
      skip "No tasks available for testing"
    end
  end

  test "alpha3s returns unique language codes" do
    # interview_with_everything creates languages: rus, pol, ger, eng
    codes = interview.alpha3s
    
    assert codes.is_a?(Array), "Should return an array"
    assert codes.all? { |c| c.is_a?(String) }, "All codes should be strings"
    assert_equal codes.uniq, codes, "Should return unique codes"
    
    # Verify it contains expected codes
    assert_includes codes, 'rus'
    assert_includes codes, 'pol'
    assert_includes codes, 'ger'
    assert_includes codes, 'eng'
  end

end
