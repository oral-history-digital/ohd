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

  describe 'export photos csv' do
    it 'should write the header correctly' do
      @csv = interview.photos_csv(:ru, false)
      @rows = @csv.split(/\n/)
      @header_row_entries = @rows[0].split(/\t/)

      expect(@header_row_entries[0]).to eq('Interview-ID')
      expect(@header_row_entries[1]).to eq('Bild-ID')
      expect(@header_row_entries[2]).to eq('Dateiname')
      expect(@header_row_entries[3]).to eq('Beschreibung')
      expect(@header_row_entries[4]).to eq('Datum')
      expect(@header_row_entries[5]).to eq('Ort')
      expect(@header_row_entries[6]).to eq('Fotograf*in/Urheber*in')
      expect(@header_row_entries[7]).to eq('Quelle/Lizenz')
      expect(@header_row_entries[8]).to eq('Format')
      expect(@header_row_entries[9]).to eq('Öffentlich')
    end

    it 'should write correct csv' do
      photo = interview.photos.first
      @csv = interview.photos_csv(:de, false)
      @rows = @csv.split(/\n/)
      @first_row_entries = @rows[1].split(/\t/)

      expect(@first_row_entries[0]).to eq(interview.archive_id)
      expect(@first_row_entries[1]).to eq(photo.public_id)
      expect(@first_row_entries[2]).to eq(photo.photo_file_name)
      expect(@first_row_entries[3]).to eq(photo.caption(:de))
      expect(@first_row_entries[4]).to eq(photo.date(:de))
      expect(@first_row_entries[5]).to eq(photo.place(:de))
      expect(@first_row_entries[6]).to eq(photo.photographer(:de))
      expect(@first_row_entries[7]).to eq(photo.license(:de))
      expect(@first_row_entries[8]).to eq(photo.photo_content_type)
      expect(@first_row_entries[9]).to eq('ja')
    end
  end
end
