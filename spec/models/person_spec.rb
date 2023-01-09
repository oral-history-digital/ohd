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

  describe "#display_name" do
    it "displays a valid name" do
      expect(person.display_name).to eq('Alice Henderson')
    end

    it "displays pseudonym if option is set" do
      person.use_pseudonym = true

      expect(person.display_name).to eq('George Sand')
    end

    context 'when first name is missing' do
      it 'displays a salutation according to gender' do
        person.first_name = nil

        expect(person.display_name).to eq('Frau Henderson')
      end
    end
  end

  describe "#alphabetical_display_name" do
    it "displays a valid name" do
      expect(person.alphabetical_display_name).to eq('Henderson, Alice')
    end

    it "displays pseudonym if option is set" do
      person.use_pseudonym = true

      expect(person.alphabetical_display_name).to eq('Sand, George')
    end
  end
end
