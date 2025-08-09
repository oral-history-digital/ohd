require 'rails_helper'

RSpec.describe UserProfile, type: :model do
  let(:user) { create(:user) }
  let(:known_language) { create(:language, code: 'en', name: 'English') }
  let(:unknown_language) { create(:language, code: 'fr', name: 'French') }

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:known_language).class_name('Language').optional }
    it { should belong_to(:unknown_language).class_name('Language').optional }
  end

  describe 'validations' do
    it { should validate_presence_of(:user_id) }
    it { should validate_uniqueness_of(:user_id) }
  end

  describe 'creating a user profile' do
    it 'can be created with valid attributes' do
      user_profile = build(:user_profile, :with_languages, user: user)
      expect(user_profile).to be_valid
    end

    it 'can be created with only user' do
      user_profile = build(:user_profile, user: user)
      expect(user_profile).to be_valid
    end

    it 'cannot be created without user' do
      user_profile = build(:user_profile, user: nil)
      expect(user_profile).not_to be_valid
      expect(user_profile.errors[:user_id]).to include("can't be blank")
    end

    it 'enforces uniqueness of user_id' do
      create(:user_profile, user: user)
      
      duplicate_profile = build(:user_profile, user: user)
      expect(duplicate_profile).not_to be_valid
      expect(duplicate_profile.errors[:user_id]).to include("has already been taken")
    end
  end

  describe 'language associations' do
    let(:user_profile) do
      create(:user_profile, :with_languages, 
        user: user,
        known_language: known_language,
        unknown_language: unknown_language
      )
    end

    it 'can access known language code' do
      expect(user_profile.known_language.code).to eq('en')
    end

    it 'can access unknown language code' do
      expect(user_profile.unknown_language.code).to eq('fr')
    end
  end
end