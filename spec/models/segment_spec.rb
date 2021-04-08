require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Segment do

  describe "subtitle-enciphered-text" do
    it "should parse <p2> correctly" do
      segment = segment_with_translations([['de', "Ich war <p3> bei Maria Malta, als <p2> das passierte."]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Ich war bei Maria Malta, als das passierte.")
    end

    it "should parse <l(bla) bla> correctly" do
      segment = segment_with_translations([['de', "Wo waren Sie <l(es) en este tiempo>?"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Wo waren Sie en este tiempo?")
    end

    it "should parse <ld(bla) bla> correctly" do
      segment = segment_with_translations([['de', "<ld(Berliner Dialekt) Ick kanns nich glob‘n>, aber ich war bei Maria Malta."]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Ick kanns nich glob‘n, aber ich war bei Maria Malta.")
    end

    it "should parse <v(bla)> correctly" do
      segment = segment_with_translations([['de', "Also den sexuellen Missbrauch <v(Räuspern)> und die die Sklavenarbeit, <v(Husten)> den harten medizinischen Missbrauch."]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Also den sexuellen Missbrauch und die die Sklavenarbeit, den harten medizinischen Missbrauch.")
    end

    it "should parse <s(bla) bla> correctly" do
      segment = segment_with_translations([['de', "Wo waren Sie <s(lachend) während dieser Zeit?>"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Wo waren Sie während dieser Zeit?")
    end

    it "should parse <nl(bla) bla> correctly" do
      segment = segment_with_translations([['de', "Wo waren <nl(Telefonklingeln) Sie während dieser> Zeit?"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Wo waren Sie während dieser Zeit?")
    end

    it "should parse <g(bla) bla> correctly" do
      segment = segment_with_translations([['de', "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) es sein>"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Und hinter dem Berg soll es sein")
    end

    it "should parse <g(bla) bla> with nested <l(es) bla> and <=> correctly" do
      segment = segment_with_translations([['de', "<g(zeigt mit Finger) Und hinter dem Berg soll> <g(zeigt mit Händen) eine<=>eine<=>eine <l(es) base> oder wie man das nennt, von den_>"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Und hinter dem Berg soll eine eine eine base oder wie man das nennt, von den_")
    end

    it "should parse <m(bla) bla> correctly" do
      segment = segment_with_translations([['de', "<m(stirnrunzelnd) Was soll ich dazu sagen?>"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("Was soll ich dazu sagen?")
    end

    it "should parse <? bla bla> correctly" do
      segment = segment_with_translations([['de', "<g(Gestikulieren) „Ja, ja, ich bin da Flughafenchef\"> und <? ich hab gesagt „Komm, äh\"> <v(Lachen)>"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("„Ja, ja, ich bin da Flughafenchef\" und (ich hab gesagt „Komm, äh\"?) ")
    end

    it "should parse (unverständlich, 1 Wort) correctly" do
      segment = segment_with_translations([['de', "wir hatten damals Rinder (unverständlich, 1 Wort) und ich ging"]])
      expect(segment.enciphered_text(:subtitle, 'de')).to eq("wir hatten damals Rinder (...?) und ich ging")
    end
  end

end
