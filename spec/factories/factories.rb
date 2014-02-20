FactoryGirl.define do

  factory :interview do
    archive_id 'za465'
    last_name 'Baschlai'
    first_name 'Sinaida'
    other_first_names 'Iwanowna'
    country_of_origin 'Russland'
  end

  factory :category do
    name 'test category'
    category_type 'test cat type'
  end

  factory :user_account do
    login 'aneumann2'
    email 'a.neumann2@mad.de'
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
