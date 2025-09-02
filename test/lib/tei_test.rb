require 'test_helper'

class TeiTest < ActiveSupport::TestCase
  test "tokenizes simple text without tags" do
    tei = Tei.new("Hello world test.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    assert_equal 4, ordinary_text.size
    assert_equal "Hello", ordinary_text[0][:content]
    assert_equal "world", ordinary_text[1][:content]
    assert_equal "test", ordinary_text[2][:content]
    assert_equal ".", ordinary_text[3][:content]
    assert_equal [], comments
  end

  test "tokenizes pause tags" do
    tei = Tei.new("Text <p3> more text.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    pause_element = ordinary_text.find { |elem| elem[:type] == 'pause' }
    assert_not_nil pause_element
    assert_equal "PT3.0S", pause_element[:attributes][:dur]
  end

  test "tokenizes vocal tags" do
    tei = Tei.new("Text <v(lacht)> more text.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    vocal_element = ordinary_text.find { |elem| elem[:type] == 'vocal' }
    assert_not_nil vocal_element
    assert_equal [:desc, "lacht", {:rend=>"<v(lacht)>"}], vocal_element[:content]
  end

  test "tokenizes simple kinesic tags without content" do
    tei = Tei.new("Text <g(nickt)> more text.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    kinesic_element = ordinary_text.find { |elem| elem[:type] == 'kinsesic' }
    assert_not_nil kinesic_element
    assert_equal [:desc, "nickt", {rend: "<g(nickt)>"}], kinesic_element[:content]
  end

  test "tokenizes kinesic tags with simple content" do
    tei = Tei.new("Before <g(nickt) some text> after.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    kinesic_comment = comments.find { |comment| comment[:type] == 'kinsesic' }
    assert_not_nil kinesic_comment
    assert_equal "nickt", kinesic_comment[:content]
    
    # Should contain the words from "some text"
    word_contents = ordinary_text.select { |elem| elem[:type] == :w }.map { |elem| elem[:content] }
    assert_includes word_contents, "Before"
    assert_includes word_contents, "some"
    assert_includes word_contents, "text"
    assert_includes word_contents, "after"
  end

  test "tokenizes speech tags with content" do
    tei = Tei.new("Before <s(gedehnt) Na ja> after.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    speech_comment = comments.find { |comment| comment[:type] == 'vocal' }
    assert_not_nil speech_comment
    assert_equal "gedehnt", speech_comment[:content]
    
    # Should contain the words from "Na ja"
    word_contents = ordinary_text.select { |elem| elem[:type] == :w }.map { |elem| elem[:content] }
    assert_includes word_contents, "Before"
    assert_includes word_contents, "Na"
    assert_includes word_contents, "ja"
    assert_includes word_contents, "after"
  end

  test "handles nested tags - the main issue case" do
    # This is the specific case mentioned in the problem statement
    text = "<g(Kopfschütteln) <s(gedehnt) Na ja,> und da ist nichts bei rausgekommen, überhaupt nichts.>"
    tei = Tei.new(text)
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    # Extract words and comments
    word_contents = ordinary_text.select { |elem| elem[:type] == :w }.map { |elem| elem[:content] }
    comment_contents = comments.map { |c| c[:content] }
    
    # Verify we get all the expected words
    expected_words = ["Na", "ja", "und", "da", "ist", "nichts", "bei", "rausgekommen", "überhaupt", "nichts"]
    expected_words.each do |word|
      assert_includes word_contents, word, "Expected to find word '#{word}' in tokenized output"
    end
    
    # Verify we get both comments: one for gesture (Kopfschütteln) and one for speech (gedehnt)
    assert_includes comment_contents, "Kopfschütteln", "Expected to find gesture comment 'Kopfschütteln'"
    assert_includes comment_contents, "gedehnt", "Expected to find speech comment 'gedehnt'"
    
    # Verify comment types
    gesture_comment = comments.find { |c| c[:content] == "Kopfschütteln" }
    speech_comment = comments.find { |c| c[:content] == "gedehnt" }
    
    assert_equal "kinsesic", gesture_comment[:type]
    assert_equal "vocal", speech_comment[:type]
    
    # Verify punctuation is handled
    punctuation = ordinary_text.select { |elem| elem[:type] == :pc }.map { |elem| elem[:content] }
    assert_includes punctuation, ","
    assert_includes punctuation, "."
  end

  test "handles deeply nested tags" do
    # Test even more complex nesting
    text = "<g(gesture1) <s(speech1) word1> <g(gesture2) word2> word3>"
    tei = Tei.new(text)
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    # Should extract all words
    word_contents = ordinary_text.select { |elem| elem[:type] == :w }.map { |elem| elem[:content] }
    assert_includes word_contents, "word1"
    assert_includes word_contents, "word2"
    assert_includes word_contents, "word3"
    
    # Should extract all comments
    comment_contents = comments.map { |c| c[:content] }
    assert_includes comment_contents, "gesture1"
    assert_includes comment_contents, "speech1"
    assert_includes comment_contents, "gesture2"
  end

  test "handles brackets and braces" do
    tei = Tei.new("Text {comment} more [note] text.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    za_comments = comments.select { |comment| comment[:type] == 'za' }
    assert_equal 1, za_comments.size
    assert_includes za_comments.map { |c| c[:content] }, "{comment}"
  end

  test "preserves backward compatibility with simple cases" do
    # Test cases that should work the same as before
    simple_cases = [
      "Simple text without any tags.",
      "Text with <p2> pause.",
      "Text with <v(laugh)> vocal annotation.",
      "Text with <g(nod)> gesture.",
      "Text with {editorial note}.",
      "Text with [unclear] annotation."
    ]
    
    simple_cases.each do |test_text|
      tei = Tei.new(test_text)
      ordinary_text, comments, index_carryover = tei.tokenized_text
      
      # Should not crash and should produce some output
      assert_not_nil ordinary_text
      assert_not_nil comments
      assert_not_nil index_carryover
    end
  end

  test "handles empty and nil text" do
    # Test edge cases
    tei = Tei.new("")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    assert_equal [], ordinary_text
    assert_equal [], comments
    
    tei = Tei.new(nil)
    ordinary_text, comments, index_carryover = tei.tokenized_text
    assert_equal [], ordinary_text
    assert_equal [], comments
  end
end
