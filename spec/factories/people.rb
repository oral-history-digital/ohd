FactoryBot.define do

  factory :person do
    gender { 'female' }
    date_of_birth { '1.1.1950' }
    #association :biographical_entries, factory: :biographical_entry
    use_pseudonym { true }
    project
  end

  factory :person_translation, class: Person::Translation do
    locale { 'de' }
    first_name { 'Konstantin' }
    last_name { 'Adamez' }
    birth_name { 'Hans' }
    other_first_names { 'Wojtowitsch' }
    alias_names { 'Адамец Константин Войтович Adamez Konstantin' }
    pseudonym_first_name { 'Max' }
    pseudonym_last_name { 'Huber' }
    description { 'Max ist ein freundlicher Mensch' }
  end

  factory :biographical_entry do
    person
    workflow_state { 'public' }
  end

  factory :biographical_entry_translation, class: BiographicalEntry::Translation do
    #biographical_entry
    locale { 'de' }
    text { 'Am Anfang, also das war...' }
  end
end

def person_with_biographical_entries(entries=[[:de, "15.09.1925: Geburt im Dorf Stasi, Bez. Dikanka, Gebiet Poltawa. Konstantin Wojtowitsch hat vier Geschwister"], [:ru, "\n\nАдамец Константин Войтович родился 15.09.1925 г. в деревне Стаси Диканьского района Полтавской области. У Константина Войтовича было три брата и одна сестр"]])
  person = FactoryBot.create(:person)
  FactoryBot.create(:person_translation, person_id: person.id)
  FactoryBot.create(:person_translation, person_id: person.id, locale: :ru,
                    first_name: "Константин", last_name: "Адамец",
                    birth_name: "Hans",
                    other_first_names: "Войтович", alias_names: "Адамец Константин Войтович Adamez Konstantin")
  FactoryBot.create(:biographical_entry,  person: person) do |biographical_entry|
    entries.each do |locale, text|
      FactoryBot.create(:biographical_entry_translation, biographical_entry_id: biographical_entry.id, locale: locale, text: text)
    end
    biographical_entry.reload
  end

  person.reload
end

