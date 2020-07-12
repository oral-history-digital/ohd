FactoryBot.define do

  factory :project do
    available_locales { ["de", "es"] }
    default_locale { "de" }
    view_modes { ["grid", "list"] }
    upload_types { ["bulk_metadata", "bulk_texts"] }
    primary_color { "#006169" }
    secondary_color { "#efae0f"}
    editorial_color { "#0ea6b3" }
    shortname { "CDOH" }
    initials { "CD" }
    domain { "http://da03.cedis.fu-berlin.de:86" }
    archive_domain { "http://localhost:3000" }
    doi { "10.5072" }
    cooperation_partner { "Stiftung 'Erinnerung, Verantwortung und Zukunft'" }
    leader { "Rinke, Stefan" }
    manager { "Kandler, Philipp; Pagenstecher, Cord; Wein, Doroth..." }
    hosting_institution { "Freie Universität Berlin, Universitätsbibliothek/C..." }
    funder_names { ["Auswärtiges Amt aufgrund eines Beschlusses des Deutschen Bundestags"] }
    contact_email { "mail@cdoh.net" }
    smtp_server { "mail.fu-berlin.de" }
    has_newsletter { true }
    is_catalog { nil }
    hidden_registry_entry_ids { [28205, 28221, 28237] }
    pdf_registry_entry_codes { [] }
    fullname_on_landing_page { nil }
    cache_key_prefix { "cdoh" }
    name { "Das Interview-Archiv „Colonia Dignidad“" }
    introduction { "Das Projekt „Colonia Dignidad – Ein chilenisch-deu..." }
    more_text { nil }
  end

  factory :interview do
    sequence(:archive_id){|n| "za46#{n}" }
    last_name { 'Baschlai' }
    first_name { 'Sinaida' }
    other_first_names { 'Iwanowna' }
    project
  end

  factory :tape do
    sequence(:media_id){|n| "ZA907_01_01_0#{n}" }
    interview
  end

  factory :usage_report do
    ip { '213.43.9.136' }
    logged_at { (Time.now - 2.months).to_s(:db) }
    action { UsageReport::LOGIN }
    parameters {}
  end

  factory :user_account do
    sequence(:login){|n| "aneumann#{n}" }
    sequence(:email){|n| "a.neumann#{n}@mad.de" }
    association :user_registration, factory: :user_registration_with_projects
  end

  factory :user_account_ip do
    user_account
    ip { '212.10.86.234' }
  end

  factory :user_registration do
    sequence(:email){|n| "user#{n}@mad.de" }

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

end
