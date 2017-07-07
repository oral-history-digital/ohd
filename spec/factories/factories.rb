FactoryGirl.define do

  factory :interview do
    sequence :archive_id {|n| "za46#{n}" }
    last_name 'Baschlai'
    first_name 'Sinaida'
    other_first_names 'Iwanowna'
  end

  factory :tape do
    sequence :media_id {|n| "ZA907_01_01_0#{n}" }
    interview
  end

  factory :usage_report do
    ip '213.43.9.136'
    logged_at (Time.now - 2.months).to_s(:db)
    action UsageReport::LOGIN
    parameters {}
  end

  factory :user_account do
    sequence :login {|n| "aneumann#{n}" }
    sequence :email {|n| "a.neumann#{n}@mad.de" }
  end

  factory :user_account_ip do
    user_account
    ip '212.10.86.234'
  end

  factory :user_registration do
    sequence :email {|n| "user#{n}@mad.de" }

    appellation 'Herr'
    first_name 'Florian'
    last_name 'Grandel'

    country 'BR'
    city 'Cabo Frio'
    zipcode '29094'
    street 'R. Victor Igreja'

    research_intentions 'Sonstiges'
    comments 'Der Proggi...'

    tos_agreement true
    priv_agreement true
  end

end
