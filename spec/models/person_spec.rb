require 'spec_helper'

describe Person do
  it "can be created together with a biography" do
    skip
    @project = Project.first || FactoryBot.create(:project)

    person = Person.create project_id: @project.id, gender: 'female',
      first_name: 'Erna', last_name: 'Sack', biography: 'Geboren und gestorben'

    expect(person.errors).to be_empty
    expect(person.first_name).to eq('Erna')
    expect(person.gender).to eq('female')
    expect(person.biographical_entries.first.text).to eq('Geboren und gestorben')
  end

  describe "#display_name" do

    it "displays a valid name" do
      person = build :person, first_name: 'Alice', last_name: 'Henderson'
      expect(person.display_name).to eq('Alice Henderson')
    end
  end
end
