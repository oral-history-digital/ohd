FactoryBot.define do
  factory :registry_entry do
    latitude { 52.52 }
    longitude { 13.40 }
    workflow_state { "public" }
    list_priority { 0 }
    association :project 
  end

  factory :registry_hierarchy do
    association :ancestor, factory: :registry_entry
    association :descendant, factory: :registry_entry
  end

  factory :registry_name do
    association :registry_entry
    association :registry_name_type
    registry_name_type_id { 1 }
    name_position { 1 }
  end

  factory :registry_name_translation, class: RegistryName::Translation do
    association :registry_name
    locale { "de" }
    descriptor { "Orte" }
  end

  factory :registry_name_type do
    code {"spelling"}
    name {"Bezeichner"}
    order_priority { 0 }
    project
  end

  factory :registry_reference_type do
    registry_entry
    project
    name { 'Geburtsort' }
  end

  factory :registry_reference do
    registry_entry
    registry_reference_type 
    interview
    workflow_state { 'checked' }
    ref_position { 0 }
  end

end

def registry_entry_with_names(names={de: 'Deutschland', ru: 'Герма́ния'})
  FactoryBot.create(:registry_entry) do |registry_entry|
    registry_name = FactoryBot.create :registry_name, registry_entry: registry_entry
    names.each do |locale, descriptor|
      FactoryBot.create(:registry_name_translation, registry_name_id: registry_name.id, descriptor: descriptor, locale: locale)
    end
    registry_entry.reload
  end
end
