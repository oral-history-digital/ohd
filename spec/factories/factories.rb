FactoryBot.define do
  
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    first_name { "Test" }
    last_name { "User" }
    country { "US" }
    city { "Test City" }
    street { "Test Street" }
    confirmed_at { Time.current }
    priv_agreement { true }
    tos_agreement { true }
  end

  factory :usage_report do
    ip { '213.43.9.136' }
    logged_at { (Time.now - 2.months).to_s(:db) }
    action { UsageReport::LOGIN }
    parameters {}
  end

  factory :user_account do
    sequence(:login){|n| "aneumann#{format('%06d', n)}" }
    sequence(:email){|n| "a.neumann#{format('%06d', n)}@mad.de" }
    password { "123456" }
    confirmed_at { Time.now - 1.day }
    association :user_registration#, factory: :user_registration_with_projects
  end

  factory :user_account_ip do
    user_account
    ip { '212.10.86.234' }
  end

  factory :user_registration do
    sequence(:email){|n| "user#{format('%06d', n)}@mad.de" }

    appellation { 'Herr' }
    first_name { 'Florian' }
    last_name { 'Grandel' }
    gender {'not_specified'}

    country { 'BR' }
    city { 'Cabo Frio' }
    zipcode { '29094' }
    street { 'R. Victor Igreja' }

    research_intentions { 'other' }
    comments { 'Der Proggi...' }

    tos_agreement { true }
    priv_agreement { true }

    factory :user_registration_with_projects do
      transient do
        projects_count { 1 }
      end

      after(:create) do |user_registration, evaluator|
        create_list(:project, evaluator.projects_count, user_registrations: [user_registration])
      end
    end
  end

  factory :user_registration_project do
    user_registration
    user_account
    project
    activated_at { Time.now - 1.day }
  end
end
