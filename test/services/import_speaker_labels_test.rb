require 'test_helper'

class ImportSpeakerLabelsTest < ActiveSupport::TestCase
  test 'uses the existing spreadsheet readers and speaker headers' do
    %w[csv ods].each do |extension|
      labels = ImportSpeakerLabels.new({ file_path: Rails.root.join("test/files/transcript_de.#{extension}") }).call
      assert labels.any?
      assert_equal labels.uniq, labels
      assert labels.none?(&:blank?)
    end
  end

  test 'reads VTT voice tags with invalid timing and ignores note and style blocks' do
    Tempfile.create(['speakers', '.vtt']) do |file|
      file.write("WEBVTT\n\nNOTE ignore <v COMMENT>\n\nSTYLE\n<v STYLE>\n\nbad --> timing\n<v IP_MH> Text\n\nwrong --> timing\n<v INT> Text\n\nwrong --> timing\n<v IP_MH> Text\n")
      file.flush
      assert_equal %w[IP_MH INT], ImportSpeakerLabels.new({ file_path: file.path }).call
    end
  end

  test 'unstructured subtitle and ODT files use the manual fallback' do
    %w[srt odt].each do |extension|
      assert_empty ImportSpeakerLabels.new({ file_path: "unused.#{extension}" }).call
    end
  end
end
