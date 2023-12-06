module DataHelper
  def self.test_data
    I18n.locale = :en

    language = Language.create!(
      code: 'en',
      name: 'English'
    )

    project = test_project

    jdupont = Person.create!(
      project: project,
      first_name: 'Jean',
      last_name: 'Dupont'
    )

    mrossi = Person.create!(
      project: project,
      first_name: 'Mario',
      last_name: 'Rossi'
    )

    registry = test_registry(project)
    ct = test_contribution_type(project)
    i = test_interview(project)

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
      priv_agreement: true,
      country: 'Germany',
      street: 'Am Lindenbaum 3',
      city: 'Berlin'
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
      priv_agreement: true,
      country: 'France',
      street: '3 rue des Petits Champs',
      city: 'Paris'
    )
    jdoe.skip_confirmation_notification!
    jdoe.save!
    jdoe.confirm!

    file = "#{Rails.root}/test/translations.sql"
    r, w = IO.pipe
    spawn('rails', 'db', '-p', in: r)
    w.write(IO.read(file))
    w.close
  end

  def self.test_project(attribs = {})
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

  def self.test_contribution_type(project, attribs = {})
    attribs.reverse_merge!(
      project: project,
      code: 'interviewee',
      label: 'Interviewee'
    )

    ContributionType.create! attribs
  end

  def self.test_registry(project, attribs = {})
    attribs.reverse_merge!(
      code: 'root',
      workflow_state: 'public',
      project: project,
      registry_names: [
        RegistryName.new(
          descriptor: "#{project.shortname} registry",
          name_position: 1,
          registry_name_type: RegistryNameType.new
        )
      ]
    )

    RegistryEntry.create! attribs
  end

  def self.test_interview(project, attribs = {})
    attribs.reverse_merge!(
      archive_id: "#{project.shortname}123"
    )

    attribs.reverse_merge!(
      project: project,
      media_type: 'audio',
      interview_languages: [
        InterviewLanguage.new(
          language: Language.find_by!(code: 'en'),
          spec: 'primary'
        )
      ],
      contributions: [
        Contribution.new(
          contribution_type: ContributionType.find_by!(code: 'interviewee'),
          person: Person.find_by!(last_name: 'Rossi')
        )
      ]
    )
    i = Interview.create! attribs

    i.update(
      tapes: [
        Tape.new(
          media_id: '45-minutes-of-silence',
          video: false
        )
      ]
    )

    MediaStream.create!(
      media_type: 'audio',
      project_id: project.id,
      path: 'http://localhost:47001/test/45-minutes-of-silence.mp3',
      resolution: '2bit'
    )

    Segment.create!(
      project: project,
      interview: i,
      tape: i.tapes.last,
      speaking_person: Person.find_by!(last_name: 'Rossi'),
      timecode: '00:17:12.00',
      text: 'My name is Mario Rossi'
    )

    i
  end

  def self.test_media
    system(
      'cp', 
      "#{Rails.root}/test/fixtures/45-minutes-of-silence.mp3",
      "#{Rails.root}/public/test/"
    )
  end

  def self.grant_access(project, user, attribs = {})
    attribs.reverse_merge!(
      project: project,
      user: user,
      tos_agreement: true,
      research_intentions: 'school_project'
    )

    ws = attribs.delete :workflow_state
    up = UserProject.create! attribs
    up.update_column :workflow_state, ws

    up
  end
end