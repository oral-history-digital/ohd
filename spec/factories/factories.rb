FactoryGirl.define do

  factory :interview do
    archive_id 'za767'
    last_name 'Abkowitsch'
    first_name 'Iossif'
    other_first_names 'Iwanowitsch'
  end

  factory :category do
    name 'test category'
    category_type 'test cat type'
  end

end
