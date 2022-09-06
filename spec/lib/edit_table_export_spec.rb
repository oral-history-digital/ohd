require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe EditTableExport do

  before(:all) do
    @interview = FactoryBot.create(:interview)
    @csv = EditTableExport.new(params[:archive_id]).process
  end

  after(:all) do
  end

  describe 'exporting an interview' do
    subject(:interview){ @interview}
    subject(:csv){ @csv}

    it 'should write a csv containing all relevant data' do
    end

end
