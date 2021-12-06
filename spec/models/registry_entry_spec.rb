require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe RegistryEntry do

  before(:all) do
    @registry_entry = FactoryBot.create :registry_entry
  end

  describe "child creation" do
    it "should create a child with a name" do
      child = @registry_entry.create_child('Orte', :de)
      child.reload
      expect(child.errors).to be_empty
      expect(child.names).to eq('Orte')
      expect(child.parents).to include(@registry_entry)
      expect(@registry_entry.children).to include(child)
    end
  end

end
