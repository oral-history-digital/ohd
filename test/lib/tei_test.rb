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
    assert_equal [:desc, "lacht"], vocal_element[:content]
  end

  test "tokenizes simple kinesic tags without content" do
    tei = Tei.new("Text <g(nickt)> more text.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    kinesic_element = ordinary_text.find { |elem| elem[:type] == 'kinesic' }
    assert_not_nil kinesic_element
    assert_equal [:desc, "nickt"], kinesic_element[:content]
  end

  test "tokenizes kinesic tags with content" do
    tei = Tei.new("Before <g(nickt) some text> after.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    kinesic_comment = comments.find { |comment| comment[:type] == 'kinestic' }
    assert_not_nil kinesic_comment
    assert_equal "nickt", kinesic_comment[:content]
  end

  test "handles nested tags - the main issue case" do
    # This is the specific case mentioned in the problem statement
    text = "<g(Kopfschütteln) <s(gedehnt) Na ja,> und da ist nichts bei rausgekommen, überhaupt nichts.>"
    tei = Tei.new(text)
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    # Let's first see what the current implementation produces
    puts "\n=== CURRENT BEHAVIOR FOR NESTED TAGS ==="
    puts "Original text: #{text}"
    puts "Ordinary text:"
    ordinary_text.each_with_index do |elem, i|
      puts "  [#{i}] #{elem.inspect}"
    end
    puts "Comments:"
    comments.each_with_index do |elem, i|
      puts "  [#{i}] #{elem.inspect}"
    end
    puts "Index carryover: #{index_carryover}"
    puts "========================================\n"
    
    # For now, just ensure it doesn't crash and produces some output
    assert_not_nil ordinary_text
    assert_not_nil comments
    
    # We expect to find the words "Na", "ja,", "und", "da", "ist", "nichts", "bei", "rausgekommen,", "überhaupt", "nichts." 
    word_contents = ordinary_text.select { |elem| elem[:type] == :w }.map { |elem| elem[:content] }
    expected_words = ["Na", "ja,", "und", "da", "ist", "nichts", "bei", "rausgekommen,", "überhaupt", "nichts"]
    
    # Check that we get the main words (this might fail with current implementation)
    expected_words.each do |word|
      assert_includes word_contents.flatten, word, "Expected to find word '#{word}' in tokenized output"
    end
    
    # Check that we get both comments: one for gesture (Kopfschütteln) and one for speech (gedehnt)
    comment_contents = comments.map { |c| c[:content] }
    assert_includes comment_contents, "Kopfschütteln", "Expected to find gesture comment 'Kopfschütteln'"
    assert_includes comment_contents, "gedehnt", "Expected to find speech comment 'gedehnt'"
  end

  test "handles brackets and braces" do
    tei = Tei.new("Text {comment} more [note] text.")
    ordinary_text, comments, index_carryover = tei.tokenized_text
    
    za_comments = comments.select { |comment| comment[:type] == 'za' }
    assert_equal 2, za_comments.size
    assert_includes za_comments.map { |c| c[:content] }, "{comment}"
    assert_includes za_comments.map { |c| c[:content] }, "[note]"
  end
end