FactoryGirl.define do

  factory :category do
    name 'test category'
    category_type 'test cat type'
  end

  factory :interview do
    archive_id 'za465'
    last_name 'Baschlai'
    first_name 'Sinaida'
    other_first_names 'Iwanowna'
    country_of_origin 'Russland'
  end

  factory :tape do
    media_id 'ZA907_01_01'
    interview
  end

  factory :usage_report do
    ip '213.43.9.136'
    logged_at (Time.now - 2.months).to_s(:db)
    action UsageReport::LOGIN
    parameters {}
  end

  factory :user_account do
    login 'aneumann2'
    email 'a.neumann2@mad.de'
  end

  factory :user_account_ip do
    user_account
    ip '212.10.86.234'
  end

  sequence :email do |n|
    "user#{n}@mad.de"
  end

  factory :user_registration do
    email

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
