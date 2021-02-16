#
# Projects
#

project1 = Project.create(
  shortname: 'test',
  initials: 't',
  domain: 'http://www.example.com',
  archive_domain: 'http://www.example.com:3000',
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
  introduction: 'This is the test archive of the oral history digital project…',
  more_text: 'more text?',
  landing_page_text: 'This is the landing page. Register please.'
)

logo1 = Logo.new(
  locale: 'en',
  title: 'Collection logo',
)

file1 = File.open('db/seeds/project1_logo.png')

logo1.file.attach(io: file1, filename: 'project1_logo.png',
  content_type: 'image/png')

project1.logos << logo1


sponsor_logo1 = SponsorLogo.new(
  locale: 'en',
  title: 'Free University of Berlin',
  href: 'https://www.fu-berlin.de/'
)

file2 = File.open('db/seeds/project1_sponsor1_logo.png')

sponsor_logo1.file.attach(io: file2, filename: 'project1_sponsor1_logo.png',
  content_type: 'image/png')

project1.sponsor_logos << sponsor_logo1


external_link1 = ExternalLink.create(
  name: 'Privacy',
  url: 'http://www.example.com/privacy.html'
)

external_link2 = ExternalLink.create(
  name: 'Terms of Use',
  url: 'http://www.example.com/terms.html'
)

project1.external_links << external_link1
project1.external_links << external_link2
