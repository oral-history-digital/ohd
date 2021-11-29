require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe MetadataImportTemplate, 'basic generation' do

  before(:all) do
    @project = Project.first || FactoryBot.create(:project)
    @csv = MetadataImportTemplate.new(@project).csv
  end

  it 'should contain all base column-headers' do
    expect(@csv.parse_csv.length).to eq(1)
  end

end
