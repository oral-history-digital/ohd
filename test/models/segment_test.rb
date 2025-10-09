require "test_helper"

class SegmentTest < ActiveSupport::TestCase
  def setup
    @segment = Segment.first
  end

  test "should parse <p2> correctly" do
    @segment.update(text: "Ich war <p2> bei Maria Malta, als <p3> das passierte.", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Ich war bei Maria Malta, als das passierte."
    )
  end

  test "should parse <l(bla) bla> correctly" do
    @segment.update(text: "Wo waren Sie <l(es) en este tiempo>?", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Wo waren Sie en este tiempo?"
    )
  end

  test "should parse <ld(bla) bla> correctly" do
    @segment.update(text: "<ld(Berliner Dialekt) Ick kanns nich glob‘n>, aber ich war bei Maria Malta.", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Ick kanns nich glob‘n, aber ich war bei Maria Malta."
    )
  end

  test "should parse <v(bla)> correctly" do
    @segment.update(text: "Also den sexuellen Missbrauch <v(Räuspern)> und die die Sklavenarbeit, <v(Husten)> den harten medizinischen Missbrauch.", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Also den sexuellen Missbrauch und die die Sklavenarbeit, den harten medizinischen Missbrauch."
    )
  end

  test "should parse <s(bla) bla> correctly" do
    @segment.update(text: "Wo waren Sie <s(lachend) während dieser Zeit?>", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Wo waren Sie während dieser Zeit?"
    )
  end

  test "should parse <nl(bla) bla> correctly" do
    @segment.update(text: "Wo waren <nl(Telefonklingeln) Sie während dieser> Zeit?", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Wo waren Sie während dieser Zeit?"
    )
  end

  test "should parse <g(bla) bla> correctly" do
    @segment.update(text: "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) es sein>", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Und hinter dem Berg soll es sein"
    )
  end

  test "should parse <g(bla)> correctly" do
    @segment.update(text: "<g(zeigt mit Händen)> soll es sein", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "soll es sein"
    )
  end

  test "should parse <g(bla) bla> with nested <l(es) bla> and <=> correctly" do
    @segment.update(text: "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) eine<=>eine<=>eine <l(es) base> oder wie man das nennt, von den_>", locale: :ger) 
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Und hinter dem Berg soll eine eine eine base oder wie man das nennt, von den_"
    )
  end

  test "should parse <m(bla) bla> correctly" do
    @segment.update(text: "<m(stirnrunzelnd) Was soll ich dazu sagen?>", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Was soll ich dazu sagen?"
    )
  end

  test "should parse <? bla bla> correctly" do
    @segment.update(text: "<g(Gestikulieren) „Ja, ja, ich bin da Flughafenchef\"> und <? ich hab gesagt „Komm, äh\"> <v(Lachen)>", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "„Ja, ja, ich bin da Flughafenchef\" und (ich hab gesagt „Komm, äh\"?) "
    )
  end

  #test "should parse (unverständlich, 1 Wort) correctly" do
    #assert_equal(
      #@segment.enciphered_text(:subtitle, "wir hatten damals Rinder (unverständlich, 1 Wort) und ich ging", :ger),
      #"wir hatten damals Rinder (...?) und ich ging"
    #)
  #end

  test "should parse <i(bla)> correctly" do
    @segment.update(text: "wir hatten damals Rinder <i(Batteriewechsel)> und ich ging", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "wir hatten damals Rinder und ich ging"
    )
  end

  test "should parse <?1> <?2> ... correctly" do
    @segment.update(text: "Ich war bei Maria <?1>, als das passierte. Ich war <?3>.", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Ich war bei Maria (...?), als das passierte. Ich war (...?)."
    )
  end

  #test "should parse <***> correctly" do
    #assert_equal(
      #@segment.enciphered_text(:subtitle, "<***>", :ger),
      #""
    #)
  #end

  test "should parse {[bla bla]} correctly" do
    @segment.update(text: "Ich war {[laughs silently]} bei Maria Malta, als das passierte.", locale: :ger)
    assert_equal(
      @segment.enciphered_text(:subtitle, :ger),
      "Ich war bei Maria Malta, als das passierte."
    )
  end

  # should not be parsed any more
  #test "should parse {[bla bla]} in public version correctly" do
    #assert_equal(
      #@segment.enciphered_text(:public, "{[laughs silently]}", :ger),
      #"[laughs silently]"
    #)
  #end

  #test "should parse <***> in public version correctly" do
    #assert_equal(
      #@segment.enciphered_text(:public, "<***>", :ger),
      #"<i(Bandende)>"
    #)
  #end
end

