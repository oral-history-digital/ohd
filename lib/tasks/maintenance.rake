namespace :maintenance do

  desc "create ohd project"
  task create_ohd_project: :environment do
    project = ProjectCreator.perform({
      available_locales: %w(de en),
      view_modes: %w(grid list),
      funder_names: %w(BMBF DFG EU),
      fullname_on_landing_page: false,
      default_locale: 'de',
      primary_color: '#e01217',
      aspect_x: 16,
      aspect_y: 9,
      shortname: 'ohd',
      archive_id_number_length: 4,
      domain: 'https://poral.oral-history.digital',
      archive_domain: OHD_DOMAIN,
      leader: 'Dr. Cord Pagenstecher',
      manager: "Dr. Cord Pagenstecher",
      contact_email: 'mail@oral-history.digital',
      has_newsletter: false,
      has_map: false,
      is_catalog: false,
      display_ohd_link: false,
      show_preview_img: false,
      workflow_state: 'public',
      locale: :de,
      introduction: "Oral-History.Digital ist eine Erschließungs- und Recherche-Plattform für Audio- oder Video-Interviews mit Zeitzeuginnen und Zeitzeugen.",
      name: 'Oral History Digital',
      grant_project_access_instantly: true,
      grant_access_without_login: true,
    }, User.where(email: 'cord.pagenstecher@cedis.fu-berlin.de').first, true)
  end

end
