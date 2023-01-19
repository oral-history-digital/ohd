require 'spec_helper'

describe 'DisplayNameCreator' do
  it "displays a valid name" do
    expect(DisplayNameCreator.perform(
      first_name: 'Alice',
      last_name: 'Henderson',
      pseudonym_first_name: 'George',
      pseudonym_last_name: 'Sand'
    )).to eq('Alice Henderson')
  end

  it "displays pseudonym if option is set" do
    expect(DisplayNameCreator.perform(
      first_name: 'Alice',
      last_name: 'Henderson',
      pseudonym_first_name: 'George',
      pseudonym_last_name: 'Sand',
      use_pseudonym: true
    )).to eq('George Sand')
  end

  it 'displays title if present' do
    expect(DisplayNameCreator.perform(
      first_name: 'Alice',
      last_name: 'Henderson',
      pseudonym_first_name: 'George',
      pseudonym_last_name: 'Sand',
      title: :doctor
    )).to eq('Dr. Alice Henderson')
  end

  context 'when first name is missing' do
    it 'displays a salutation according to gender' do
      expect(DisplayNameCreator.perform(
        first_name: '',
        last_name: 'Henderson',
        gender: :female
      )).to eq('Frau Henderson')
    end

    it 'displays a pseudonym if set' do
      expect(DisplayNameCreator.perform(
        first_name: 'Alice',
        last_name: 'Henderson',
        pseudonym_first_name: '',
        pseudonym_last_name: 'Sand',
        use_pseudonym: true,
        gender: :female
      )).to eq('Frau Sand')
    end

    it 'displays title if present' do
      expect(DisplayNameCreator.perform(
        first_name: '',
        last_name: 'Henderson',
        gender: :female,
        title: :doctor
      )).to eq('Frau Dr. Henderson')
    end
  end
end
