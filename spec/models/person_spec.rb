require 'spec_helper'

describe Person do
  let(:person) { build :person, first_name: 'Alice', last_name: 'Henderson',
    pseudonym_first_name: 'George', pseudonym_last_name: 'Sand',
    gender: 'female' }

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

  describe "#alphabetical_display_name" do
    it "displays a valid name" do
      expect(person.alphabetical_display_name).to eq('Henderson, Alice')
    end

    it "displays pseudonym if option is set" do
      person.use_pseudonym = true

      expect(person.alphabetical_display_name).to eq('Sand, George')
    end

    context 'when first name is missing' do
      it 'just displays the last name' do
        person.first_name = nil

        expect(person.alphabetical_display_name).to eq('Henderson')
      end
    end
  end
end
