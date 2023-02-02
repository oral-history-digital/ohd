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

  describe '#first_name_used' do
    it 'returns real first name' do
      expect(person.first_name_used).to eq('Alice')
    end

    it 'returns pseudonym first name if use_pseudonym is set' do
      person.use_pseudonym = true

      expect(person.first_name_used).to eq('George')
    end
  end

  describe '#last_name_used' do
    it 'returns real last name' do
      expect(person.last_name_used).to eq('Henderson')
    end

    it 'returns pseudonym last name if use_pseudonym is set' do
      person.use_pseudonym = true

      expect(person.last_name_used).to eq('Sand')
    end
  end

  describe '#display_name' do
    it "displays a valid name" do
      expect(person.display_name).to eq('Alice Henderson')
    end

    it 'displays title if present' do
      person.title = 'doctor'
      expect(person.display_name).to eq('Dr. Alice Henderson')
    end

    context 'when first name is missing' do
      it 'displays a salutation according to gender' do
        person.first_name = ''
        expect(person.display_name).to eq('Frau Henderson')
      end

      it 'displays title if present' do
        person.first_name = ''
        person.title = 'doctor'
        expect(person.display_name).to eq('Frau Dr. Henderson')
      end
    end
  end

  describe "#initials" do
    it 'returns initials for simple names' do
      expect(person.initials).to eq('AH')
    end

    it 'returns initials for complex names' do
      person.first_name = 'Maria Gonzales'
      person.last_name = 'Rodriguez'

      expect(person.initials).to eq('MR')
    end

    it 'returns just the last name if the first name is missing' do
      person.first_name = nil

      expect(person.initials).to eq('H')
    end
  end
end
