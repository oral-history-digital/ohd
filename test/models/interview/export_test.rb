require "test_helper"
require 'stringio'

class Interview::ExportTest < ActiveSupport::TestCase
  def setup
    @project = DataHelper.project_with_contribution_types_and_metadata_fields
    @interview = DataHelper.interview_with_everything(@project, 1)
  end

  def interview
    @interview
  end

  test 'exporting to vtt should write the original transcript of tape 1' do
    @vtt = interview.to_vtt(:ru, 1)
    assert_equal("WEBVTT\n\n1\n00:00:02.000 --> 00:00:09.000\nИтак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца\n", @vtt)
  end

  test 'exporting to vtt should write the original transcript of tape 2' do
    @vtt = interview.to_vtt(:ru, 2)
    assert_equal("WEBVTT\n\n1\n00:02:02.000 --> 00:02:09.000\nИ, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни\n", @vtt)
  end

  test 'exporting to vtt should write the translation of tape 1' do
    @vtt = interview.to_vtt(:de, 1)
    assert_equal("WEBVTT\n\n1\n00:00:02.000 --> 00:00:09.000\nAlso gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez\n", @vtt)
  end

  test 'exporting to csv should write the header correctly' do
    @csv = interview.to_csv(:ru, 1)
    @rows = @csv.split(/\n/)
    @header_row_entries = @rows[0].split(/\t/)

    assert_equal("Timecode", @header_row_entries[0])
    assert_equal("Speaker", @header_row_entries[1])
    assert_equal("Transkript", @header_row_entries[2])
  end

  test 'exporting to csv should write the original transcript of tape 1' do
    @csv = interview.to_csv(:ru, 1)
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)

    assert_equal("00:00:02.00", @first_row_entries[0])
    assert_equal("INT", @first_row_entries[1])
    assert_equal("Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца", @first_row_entries[2])
  end

  test 'exporting to csv should write the original transcript of tape 2' do
    @csv = interview.to_csv(:ru, 2)
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)

    assert_equal("00:02:02.00", @first_row_entries[0])
    assert_equal("AB", @first_row_entries[1])
    assert_equal("И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни", @first_row_entries[2])
  end

  test 'exporting to csv should write the translation of tape 1' do
    @csv = interview.to_csv(:de, 1)
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)

    assert_equal("00:00:02.00", @first_row_entries[0])
    assert_equal("INT", @first_row_entries[1])
    assert_equal("Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez", @first_row_entries[2])
  end

  test 'export photos csv should write the header correctly' do
    @csv = interview.photos_csv(:ru, false)
    @rows = @csv.split(/\n/)
    @header_row_entries = @rows[0].split(/\t/)

    assert_equal('Interview-ID', @header_row_entries[0])
    assert_equal('Bild-ID', @header_row_entries[1])
    assert_equal('Dateiname', @header_row_entries[2])
    assert_equal('Beschreibung', @header_row_entries[3])
    assert_equal('Datum', @header_row_entries[4])
    assert_equal('Ort', @header_row_entries[5])
    assert_equal('Fotograf*in/Urheber*in', @header_row_entries[6])
    assert_equal('Quelle/Lizenz', @header_row_entries[7])
    assert_equal('Format', @header_row_entries[8])
    assert_equal('Öffentlich', @header_row_entries[9])
  end

  test 'export photos csv should write correct csv' do
    photo = interview.photos.first
    @csv = interview.photos_csv(:de, false)
    @rows = @csv.split(/\n/)
    @first_row_entries = @rows[1].split(/\t/)

    assert_equal(interview.archive_id, @first_row_entries[0])
    assert_equal(photo.public_id, @first_row_entries[1])
    assert_equal(photo.photo_file_name, @first_row_entries[2])
    assert_equal(photo.caption(:de), @first_row_entries[3])
    assert_equal(photo.date(:de), @first_row_entries[4])
    assert_equal(photo.place(:de), @first_row_entries[5])
    assert_equal(photo.photographer(:de), @first_row_entries[6])
    assert_equal(photo.license(:de), @first_row_entries[7])
    assert_equal(photo.photo_content_type, @first_row_entries[8])
    assert_equal(@first_row_entries[9], 'ja')
  end

  #test 'should export transcript PDF correctly' do
    #pdf = interview.to_pdf(:ru, :de)
    ## analyze returns strings without whitespace
    ##pdf_analysis = PDF::Inspector::Text.analyze(pdf)
    ##expect(pdf_analysis.strings.include?("Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez".gsub(/\s+/, ""))).to be_truthy
    #reader = PDF::Reader.new(StringIO.new(pdf))
    #assert_match(/Das Interview-Archiv/, reader.pages[0].text)
    #assert_match(/Also gut, heute ist der 10. September 2005, und wir sind bei/, reader.pages[4].text)
    #assert_match(/Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte/, reader.pages[4].text)
  #end

  #test 'should export biography PDF correctly' do
    #pdf = interview.biography_pdf(:de, :de)
    ##pdf_analysis = PDF::Inspector::Text.analyze(pdf)
    ##expect(pdf_analysis.strings.include?("15.09.1925: Geburt im Dorf Stasi, Bez. Dikanka, Gebiet Poltawa. Konstantin Wojtowitsch hat vier Geschwister".gsub(/\s+/, ""))).to be_truthy
    #reader = PDF::Reader.new(StringIO.new(pdf))
    #assert_match(/Das Interview-Archiv/, reader.pages[0].text)
    #assert_match(/15.09.1925: Geburt im Dorf Stasi, Bez. Dikanka, Gebiet /, reader.pages[0].text)
  #end

  #test 'should export observations PDF correctly' do
    #pdf = interview.observations_pdf(:ru, :de)
    ##pdf_analysis = PDF::Inspector::Text.analyze(pdf)
    ##expect(pdf_analysis.strings.include?('1\nInternational Slave- und Forced Labourers Documentation Project – Internationales Sklaven- und Zwangsarbeiter Befragungsprojekt\nInterview mit Adamez Konstantin Wojtowitsch\nProtokoll\nAudiointerview am 10. September 2005 in Minsk \t\n(Weißrussland/Belarus)\nAdresse: Wohnung von Adamez Konstantin Wojtowitsch'.gsub(/\s+/, ""))).to be_truthy
    #reader = PDF::Reader.new(StringIO.new(pdf))
    #assert_match(/Das Interview-Archiv/, reader.pages[0].text)
    #assert_match(/International Slave- und Forced Labourers Documentation Project/, reader.pages[0].text)
  #end

end

