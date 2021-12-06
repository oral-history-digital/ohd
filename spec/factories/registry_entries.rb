FactoryBot.define do
  factory :registry_entry do
    latitude { 52.52 }
    longitude { 13.40 }
    workflow_state { "public" }
    list_priority { 0 }
    association :project 

    after :create do |registry_entry|
      create_list :registry_name, 2, registry_entry: registry_entry
    end
  end

  factory :registry_hierarchy do
    association :ancestor, factory: :registry_entry
    association :descendant, factory: :registry_entry
  end

  factory :registry_name do
    association :registry_entry
    #association :registry_name_type
    registry_name_type_id { 1 }
    name_position { 1 }
    after :create do |registry_name|
      create_list :registry_name_translation, 2, registry_name_id: registry_name.id
    end
  end

  factory :registry_name_translation, class: RegistryName::Translation do
    association :registry_name
    sequence(:locale){|n| "de_#{n}" }
    #locale { "de" }
    descriptor { "Orte" }
  end

  factory :registry_name_type do
    after :create do |registry_name_type|
      create_list :registry_name_type_translation, 2, registry_name_type: registry_name_type
    end
  end

  factory :registry_name_type_translation do
    association :registry_name_type
    locale { "de" }
    descriptor { "Orte" }
  end

  factory :registry_reference_type do
    registry_entry
    project
    name { 'Geburtsort' }
  end

end

