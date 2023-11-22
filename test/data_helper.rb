module DataHelper
  def test_data
    I18n.locale = :en

    project = test_project
    registry = test_registry(project)

    institution = Institution.create!(
      name: "Test Institute",
      shortname: 'test_inst',
      projects: [project]
    )

    admin = User.new(
      login: 'alice@example.com',
      email: 'alice@example.com',
      password: 'password',
      password_confirmation: 'password',
      first_name: 'Alice',
      last_name: 'Henderson',
      admin: true,
      tos_agreement: true,
      tos_agreed_at: DateTime.now,
      priv_agreement: true
    )
    admin.skip_confirmation_notification!
    admin.save!
    admin.confirm!

    jdoe = User.new(
      login: 'john@example.com',
      email: 'john@example.com',
      password: 'password',
      password_confirmation: 'password',
      first_name: 'John',
      last_name: 'Doe',
      tos_agreement: true,
      tos_agreed_at: DateTime.now,
      priv_agreement: true
    )
    jdoe.skip_confirmation_notification!
    jdoe.save!
    jdoe.confirm!

    language = Language.create!(
      code: 'en',
      name: 'English'
    )

    file = "#{Rails.root}/test/translations.sql"
    r, w = IO.pipe
    spawn('rails', 'db', '-p', in: r)
    w.write(IO.read(file))
    w.close
  end

  def test_project(attribs = {})
    attribs.reverse_merge!(
      shortname: 'test',
      domain: 'http://test.portal.oral-history.localhost:47001',
      archive_domain: 'http://test.portal.oral-history.localhost:47001',
      available_locales: ['en'],
      default_locale: 'en',
      contact_email: 'info@example.com',
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
      landing_page_text: 'This is the landing page. Register please.',
      workflow_state: 'public'
    )

    Project.create! attribs
  end

  def test_registry(project, attribs = {})
    attribs.reverse_merge!(
      code: 'root',
      workflow_state: 'public',
      project: project
    )

    RegistryEntry.create! attribs
  end
end