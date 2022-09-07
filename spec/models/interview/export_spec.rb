require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe Interview::Export do

  before(:all) do
    @interview = interview_with_everything
  end
  subject(:interview){@interview}

  describe 'exporting to vtt' do
    it 'should write the original transcript of tape 1' do
      @vtt = interview.to_vtt(:ru, 1)
      expect(@vtt).to eq("WEBVTT\n\n1\n00:00:02.000 --> 00:00:09.000\nИтак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца\n")
    end

    it 'should write the original transcript of tape 2' do
      @vtt = interview.to_vtt(:ru, 2)
      expect(@vtt).to eq("WEBVTT\n\n1\n00:02:02.000 --> 00:02:09.000\nИ, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни\n")
    end

    it 'should write the translation of tape 1' do
      @vtt = interview.to_vtt(:de, 1)
      expect(@vtt).to eq("WEBVTT\n\n1\n00:00:02.000 --> 00:00:09.000\nAlso gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez\n")
    end
  end

  describe 'exporting to csv' do
    it 'should write the header correctly' do
      @csv = interview.to_csv(:ru, 1)
      @rows = @csv.split(/\n/)
      @header_row_entries = @rows[0].split(/\t/)

      expect(@header_row_entries[0]).to eq("Timecode")
      expect(@header_row_entries[1]).to eq("Speaker")
      expect(@header_row_entries[2]).to eq("Transkript")
    end

    it 'should write the original transcript of tape 1' do
      @csv = interview.to_csv(:ru, 1)
      @rows = @csv.split(/\n/)
      @first_row_entries = @rows[1].split(/\t/)

      expect(@first_row_entries[0]).to eq("00:00:02.00")
      expect(@first_row_entries[1]).to eq("INT")
      expect(@first_row_entries[2]).to eq("Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца")
    end

    it 'should write the original transcript of tape 2' do
      @csv = interview.to_csv(:ru, 2)
      @rows = @csv.split(/\n/)
      @first_row_entries = @rows[1].split(/\t/)

      expect(@first_row_entries[0]).to eq("00:02:02.00")
      expect(@first_row_entries[1]).to eq("AB")
      expect(@first_row_entries[2]).to eq("И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни")
    end

    it 'should write the translation of tape 1' do
      @csv = interview.to_csv(:de, 1)
      @rows = @csv.split(/\n/)
      @first_row_entries = @rows[1].split(/\t/)

      expect(@first_row_entries[0]).to eq("00:00:02.00")
      expect(@first_row_entries[1]).to eq("INT")
      expect(@first_row_entries[2]).to eq("Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez")
    end
  end
end
