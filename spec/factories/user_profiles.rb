FactoryBot.define do
  factory :user_profile do
    association :user
    
    trait :with_languages do
      association :known_language, factory: :language
      association :unknown_language, factory: :language  
    end
  end
end