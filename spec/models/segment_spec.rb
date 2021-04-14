require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Segment do

  let!(:segment){FactoryBot.create(:segment)}

  describe "subtitle-enciphered-text" do
    it "should parse <p2> correctly" do
      expect(segment.enciphered_text(:subtitle, "Ich war <p3> bei Maria Malta, als <p2> das passierte.")).
      to eq("Ich war bei Maria Malta, als das passierte.")
    end

    it "should parse <l(bla) bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "Wo waren Sie <l(es) en este tiempo>?")).
      to eq("Wo waren Sie en este tiempo?")
    end

    it "should parse <ld(bla) bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "<ld(Berliner Dialekt) Ick kanns nich glob‘n>, aber ich war bei Maria Malta.")).
      to eq("Ick kanns nich glob‘n, aber ich war bei Maria Malta.")
    end

    it "should parse <v(bla)> correctly" do
      expect(segment.enciphered_text(:subtitle, "Also den sexuellen Missbrauch <v(Räuspern)> und die die Sklavenarbeit, <v(Husten)> den harten medizinischen Missbrauch.")).
      to eq("Also den sexuellen Missbrauch und die die Sklavenarbeit, den harten medizinischen Missbrauch.")
    end

    it "should parse <s(bla) bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "Wo waren Sie <s(lachend) während dieser Zeit?>")).
      to eq("Wo waren Sie während dieser Zeit?")
    end

    it "should parse <nl(bla) bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "Wo waren <nl(Telefonklingeln) Sie während dieser> Zeit?")).
      to eq("Wo waren Sie während dieser Zeit?")
    end

    it "should parse <g(bla) bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) es sein>")).
      to eq("Und hinter dem Berg soll es sein")
    end

    it "should parse <g(bla)> correctly" do
      expect(segment.enciphered_text(:subtitle, "<g(zeigt mit Händen)> soll es sein")).
      to eq("soll es sein")
    end

    it "should parse <g(bla) bla> with nested <l(es) bla> and <=> correctly" do
      expect(segment.enciphered_text(:subtitle, "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) eine<=>eine<=>eine <l(es) base> oder wie man das nennt, von den_>")).
      to eq("Und hinter dem Berg soll eine eine eine base oder wie man das nennt, von den_")
    end

    it "should parse <m(bla) bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "<m(stirnrunzelnd) Was soll ich dazu sagen?>")).
      to eq("Was soll ich dazu sagen?")
    end

    it "should parse <? bla bla> correctly" do
      expect(segment.enciphered_text(:subtitle, "<g(Gestikulieren) „Ja, ja, ich bin da Flughafenchef\"> und <? ich hab gesagt „Komm, äh\"> <v(Lachen)>")).
      to eq("„Ja, ja, ich bin da Flughafenchef\" und (ich hab gesagt „Komm, äh\"?) ")
    end

    it "should parse (unverständlich, 1 Wort) correctly" do
      expect(segment.enciphered_text(:subtitle, "wir hatten damals Rinder (unverständlich, 1 Wort) und ich ging")).
      to eq("wir hatten damals Rinder (...?) und ich ging")
    end

    it "should parse <i(bla)> correctly" do
      expect(segment.enciphered_text(:subtitle, "wir hatten damals Rinder <i(Batteriewechsel)> und ich ging")).
      to eq("wir hatten damals Rinder und ich ging")
    end

    it "should parse <?1> <?2> ... correctly" do
      expect(segment.enciphered_text(:subtitle, "Ich war bei Maria <?1>, als das passierte. Ich war <?3>.")).
      to eq("Ich war bei Maria (...?), als das passierte. Ich war (...?).")
    end

    it "should parse <***> correctly" do
      expect(segment.enciphered_text(:subtitle, "<***>")).
      to eq("")
    end

    it "should parse {[bla bla]} correctly" do
      expect(segment.enciphered_text(:subtitle, "{[laughs silently]}")).
      to eq("")
    end
  end

  describe "public-enciphered-text" do
    it "should parse {[bla bla]} correctly" do
      expect(segment.enciphered_text(:public, "{[laughs silently]}")).
      to eq("[laughs silently]")
    end

    it "should parse <***> correctly" do
      expect(segment.enciphered_text(:public, "<***>")).
      to eq("<i(Bandende)>")
    end
  end
end
