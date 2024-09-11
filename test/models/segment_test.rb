require "test_helper"

class SegmentTest < ActiveSupport::TestCase
  def setup
    @segment = Segment.first
  end

  test "should parse <p2> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "Ich war <p3> bei Maria Malta, als <p2> das passierte.", :de),
      "Ich war bei Maria Malta, als das passierte."
    )
  end

  test "should parse <l(bla) bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "Wo waren Sie <l(es) en este tiempo>?", :de),
      "Wo waren Sie en este tiempo?"
    )
  end

  test "should parse <ld(bla) bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<ld(Berliner Dialekt) Ick kanns nich glob‘n>, aber ich war bei Maria Malta.", :de),
      "Ick kanns nich glob‘n, aber ich war bei Maria Malta."
    )
  end

  test "should parse <v(bla)> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "Also den sexuellen Missbrauch <v(Räuspern)> und die die Sklavenarbeit, <v(Husten)> den harten medizinischen Missbrauch.", :de),
      "Also den sexuellen Missbrauch und die die Sklavenarbeit, den harten medizinischen Missbrauch."
    )
  end

  test "should parse <s(bla) bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "Wo waren Sie <s(lachend) während dieser Zeit?>", :de),
      "Wo waren Sie während dieser Zeit?"
    )
  end

  test "should parse <nl(bla) bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "Wo waren <nl(Telefonklingeln) Sie während dieser> Zeit?", :de),
      "Wo waren Sie während dieser Zeit?"
    )
  end

  test "should parse <g(bla) bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) es sein>", :de),
      "Und hinter dem Berg soll es sein"
    )
  end

  test "should parse <g(bla)> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<g(zeigt mit Händen)> soll es sein", :de),
      "soll es sein"
    )
  end

  test "should parse <g(bla) bla> with nested <l(es) bla> and <=> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) eine<=>eine<=>eine <l(es) base> oder wie man das nennt, von den_>", :de),
      "Und hinter dem Berg soll eine eine eine base oder wie man das nennt, von den_"
    )
  end

  test "should parse <m(bla) bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<m(stirnrunzelnd) Was soll ich dazu sagen?>", :de),
      "Was soll ich dazu sagen?"
    )
  end

  test "should parse <? bla bla> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<g(Gestikulieren) „Ja, ja, ich bin da Flughafenchef\"> und <? ich hab gesagt „Komm, äh\"> <v(Lachen)>", :de),
      "„Ja, ja, ich bin da Flughafenchef\" und (ich hab gesagt „Komm, äh\"?) "
    )
  end

  test "should parse (unverständlich, 1 Wort) correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "wir hatten damals Rinder (unverständlich, 1 Wort) und ich ging", :de),
      "wir hatten damals Rinder (...?) und ich ging"
    )
  end

  test "should parse <i(bla)> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "wir hatten damals Rinder <i(Batteriewechsel)> und ich ging", :de),
      "wir hatten damals Rinder und ich ging"
    )
  end

  test "should parse <?1> <?2> ... correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "Ich war bei Maria <?1>, als das passierte. Ich war <?3>.", :de),
      "Ich war bei Maria (...?), als das passierte. Ich war (...?)."
    )
  end

  test "should parse <***> correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "<***>", :de),
      ""
    )
  end

  test "should parse {[bla bla]} correctly" do
    assert_equal(
      @segment.enciphered_text(:subtitle, "{[laughs silently]}", :de),
      ""
    )
  end

  test "should parse {[bla bla]} in public version correctly" do
    assert_equal(
      @segment.enciphered_text(:public, "{[laughs silently]}", :de),
      "[laughs silently]"
    )
  end

  test "should parse <***> in public version correctly" do
    assert_equal(
      @segment.enciphered_text(:public, "<***>", :de),
      "<i(Bandende)>"
    )
  end
end

