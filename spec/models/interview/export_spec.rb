require File.expand_path(File.dirname(__FILE__) + '/../../spec_helper')

describe Interview::Export do

  before(:all) do
    @interview = interview_with_everything
  end
  subject(:interview){@interview}

  describe 'exporting to csv' do
    #before(:all) do
      #@rows = @csv.split(/\n/)
      #@first_row_entries = @rows[1].split(/\t/)
      #@second_row_entries = @rows[2].split(/\t/)
    #end

    #subject(:csv){@csv}
    #subject(:rows){@rows}
    #subject(:first_row_entries){@first_row_entries}
    #subject(:second_row_entries){@second_row_entries}

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
