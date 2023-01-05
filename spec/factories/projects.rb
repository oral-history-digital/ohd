FactoryBot.define do

  factory :project do
    available_locales { ["de", "es"] }
    default_locale { "de" }
    view_modes { ["grid", "list"] }
    upload_types { ["bulk_metadata", "bulk_texts"] }
    primary_color { "#006169" }
    secondary_color { "#efae0f"}
    editorial_color { "#0ea6b3" }
    sequence(:shortname, ('a'..'z').to_a.shuffle[0,4].join)
    domain { "http://da03.cedis.fu-berlin.de:86" }
    archive_domain { "http://localhost:3000" }
    doi { "10.5072" }
    cooperation_partner { "Stiftung 'Erinnerung, Verantwortung und Zukunft'" }
    leader { "Rinke, Stefan" }
    manager { "Kandler, Philipp; Pagenstecher, Cord; Wein, Doroth..." }
    funder_names { ["Auswärtiges Amt aufgrund eines Beschlusses des Deutschen Bundestags"] }
    contact_email { "mail@cdoh.net" }
    smtp_server { "mail.fu-berlin.de" }
    has_newsletter { true }
    is_catalog { nil }
    hidden_registry_entry_ids { [28205, 28221, 28237] }
    pdf_registry_entry_ids { [] }
    aspect_x { 16 }
    aspect_y { 9 }
    archive_id_number_length { 3 }
    fullname_on_landing_page { nil }
    cache_key_prefix { "cdoh" }
    name { "Das Interview-Archiv „Colonia Dignidad“" }
    introduction { "Das Projekt „Colonia Dignidad – Ein chilenisch-deu..." }
    more_text { nil }
  end

end

def project_with_contribution_types_and_metadata_fields
  FactoryBot.create(:project) do |project|

    %w(interviewee interviewer translator transcriptor research).each do |code|
      use_in_export = code != 'interviewee'
      FactoryBot.create(:contribution_type, project: project, code: code, use_in_export: use_in_export)
    end

    places = FactoryBot.create :registry_entry, code: 'places', project: project

    {
      birth_location: 'Geburtsort',
      interview_location: 'Interviewort'
    }.each do |code, name|
      registry_reference_type = FactoryBot.create(
        :registry_reference_type,
        registry_entry: places,
        project: project,
        name: name,
        code: code
      )
      FactoryBot.create(
        :metadata_field,
        registry_reference_type: registry_reference_type,
        ref_object_type: code == :birth_location ? 'Person' : 'Interview',
        project: project,
        label: name,
        name: code
      )
    end
    project.reload
  end
end
