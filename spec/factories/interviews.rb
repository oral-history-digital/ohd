FactoryBot.define do

  factory :interview do
    sequence(:archive_id){|n| "za#{format('%03d', n)}" }
    media_type { 'video' }
    project
    collection
    after :create do |interview|
      create_list :tape, 2, interview: interview
    end
    properties {{}}
  end

  factory :tape do
    sequence(:media_id){|n| "ZA907_01_01_0#{n}" }
    interview
  end

  factory :collection do
    sequence(:name){|n| "Teilsammlung #{n}" }
    project
  end

  factory :contribution do
    contribution_type_id { 1 }
    speaker_designation { 'INT' }
    person
    interview
  end

  factory :person do
    gender { 'female' }
  end
end

def interview_with_contributions
  FactoryBot.create(:interview) do |interview|
    %w(INT AB KAM).each do |speaker_designation|
      person = FactoryBot.create :person
      FactoryBot.create(:contribution, interview: interview, speaker_designation: speaker_designation)
    end
    interview.reload
  end
end
