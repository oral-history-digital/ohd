#
# Projects
#

def assign_known_attributes(record, attrs)
  attrs.each do |key, value|
    setter = "#{key}="
    record.public_send(setter, value) if record.respond_to?(setter)
  end
end

test_project_attrs = {
  shortname: 'test',
  domain: 'http://www.example.com',
  archive_domain: 'http://portal.oral-history.localhost:3000',
  available_locales: ['en'],
  default_locale: 'en',
  contact_email: 'info@example.com',
  hosting_institution: 'Free University of Berlin',
  aspect_x: 16,
  aspect_y: 9,
  archive_id_number_length: 3,
  primary_color: '#336699',
  secondary_color: '#660033',
  has_map: false,
  is_catalog: false,
  has_newsletter: false,
  fullname_on_landing_page: false,
  view_modes: ['grid', 'list'],
  name: 'The test archive',
  introduction: 'This is the test archive of the oral history digital project...',
  more_text: 'more text?',
  landing_page_text: 'This is the landing page. Register please.'
}

project1 = Project.find_or_initialize_by(shortname: 'test')
assign_known_attributes(project1, test_project_attrs)
project1.save!

ohd_project = Project.find_or_initialize_by(shortname: 'ohd')
assign_known_attributes(
  ohd_project,
  {
    domain: 'http://portal.oral-history.localhost:3000',
    archive_domain: 'http://portal.oral-history.localhost:3000',
    available_locales: ['en'],
    default_locale: 'en',
    view_modes: ['grid', 'list'],
    contact_email: 'info@example.com',
    primary_color: '#336699',
    secondary_color: '#660033',
    name: 'OHD Portal',
    introduction: 'Portal project for local development.'
  }
)
ohd_project.save!

[project1, ohd_project].each do |project|
  root_entry = project.registry_entries.find_or_initialize_by(code: 'root')
  root_entry.workflow_state ||= 'public'
  root_entry.save!
  root_entry.translations.find_or_create_by!(locale: 'en')
end

institution = Institution.find_or_initialize_by(shortname: 'test-institution')
institution.name = 'Free University of Berlin'
institution.save!

InstitutionProject.find_or_create_by!(project: project1, institution: institution)

collection = Collection.find_or_initialize_by(project: project1, shortname: 'test-collection')
collection.institution = institution
collection.workflow_state ||= 'public'
collection.name = 'Test Collection'
collection.save!

logo_path = 'db/seeds/project1_logo.png'
if File.exist?(logo_path) && project1.logos.empty?
  logo = Logo.new(ref: project1, locale: 'en', title: 'Collection logo')
  file = File.open(logo_path)
  begin
    logo.file.attach(io: file, filename: 'project1_logo.png', content_type: 'image/png')
    logo.save!
  ensure
    file.close
  end
end

sponsor_logo_path = 'db/seeds/project1_sponsor1_logo.png'
if File.exist?(sponsor_logo_path) && project1.sponsor_logos.empty?
  sponsor_logo = SponsorLogo.new(
    ref: project1,
    locale: 'en',
    title: 'Free University of Berlin',
    href: 'https://www.fu-berlin.de/'
  )
  file = File.open(sponsor_logo_path)
  begin
    sponsor_logo.file.attach(io: file, filename: 'project1_sponsor1_logo.png', content_type: 'image/png')
    sponsor_logo.save!
  ensure
    file.close
  end
end

external_link1 = ExternalLink.find_or_create_by!(project: project1, internal_name: 'privacy') do |link|
  link.name = 'Privacy'
  link.url = 'http://www.example.com/privacy.html'
end

external_link2 = ExternalLink.find_or_create_by!(project: project1, internal_name: 'terms') do |link|
  link.name = 'Terms of Use'
  link.url = 'http://www.example.com/terms.html'
end

project1.external_links << external_link1 unless project1.external_links.exists?(external_link1.id)
project1.external_links << external_link2 unless project1.external_links.exists?(external_link2.id)
