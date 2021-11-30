require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Person do

  before(:all) do
    @project = Project.first || FactoryBot.create(:project)
  end

  describe "creation" do
    it "should create a person with biography" do
      person = Person.create project_id: @project.id, gender: 'female', first_name: 'Erna', last_name: 'Sack', biography: 'Geboren und gestorben'
      expect(person.errors).to be_empty
      expect(person.first_name).to eq('Erna')
      expect(person.gender).to eq('female')
      expect(person.biographical_entries.first.text).to eq('Geboren und gestorben')
    end
  end
end
