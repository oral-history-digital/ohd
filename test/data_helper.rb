module DataHelper
  def self.test_data
    I18n.locale = :en

    language = Language.create!(
      code: 'en',
      name: 'English'
    )

    project = test_project
    ohd_project_attributes = {
      shortname: 'ohd',
      domain: 'http://test.portal.oral-history.localhost:47001',
      archive_domain: 'http://test.portal.oral-history.localhost:47001',
      name: 'OHD',
      introduction: 'This is the test OHD archive of the oral history digital project…',
      registry_reference_types: [
        RegistryReferenceType.create(
          code: "level_of_indexing_ohd",
          children_only: false,
          use_in_transcript: false,
          name: "Erschliessungsgrad (oh.d)"
        ),
        RegistryReferenceType.create(
          code: "subjects_ohd",
          children_only: false,
          use_in_transcript: false,
          name: "Thema (oh.d)"
        ),
        RegistryReferenceType.create(
          code: "countries_ohd",
          children_only: false,
          use_in_transcript: false,
          name: "Länder (oh.d)"
        ),
      ]
    }
    ohd = test_project(ohd_project_attributes)

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

    root_registry_entry = RegistryEntry.create!(
      project_id: project.id,
      code: 'root',
      workflow_state: 'public'
    )

    ohd_registry = test_registry(ohd)

    # default_registry_name_type = RegistryNameType.find_by!(code: "spelling")

    # RegistryName.create(
    #   registry_entry_id: root_registry_entry.id,
    #   registry_name_type_id: default_registry_name_type.id,
    #   name_position: 0,
    #   descriptor: I18n.t('registry', locale: project.default_locale),
    #   locale: project.default_locale
    # )

    # ['places', 'people', 'subjects'].each do |code|
    #   entry = RegistryEntry.create(
    #     project_id: project.id,
    #     code: code,
    #     workflow_state: 'public'
    #   )

    #   registry_name = RegistryName.create(
    #     registry_entry_id: entry.id,
    #     registry_name_type_id: default_registry_name_type.id,
    #     name_position: 0,
    #   )

    #   # add_translations(registry_name, 'descriptor', code)

    #   RegistryHierarchy.find_or_create_by(
    #     ancestor_id: root_registry_entry.id,
    #     descendant_id: entry.id
    #   )
    # end

    RegistryReferenceType.create(
      code: 'birth_location',
      name: 'Birth location',
      registry_entry_id: project.registry_entries.where(code: 'root').first.id,
      project_id: project.id,
      use_in_transcript: true,
    )

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
      city: 'Berlin',
      default_locale: 'en'
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
      city: 'Paris',
      default_locale: 'en'
    )
    jdoe.skip_confirmation_notification!
    jdoe.save!
    jdoe.confirm!

    file = "#{Rails.root}/test/translations.sql"
    r, w = IO.pipe
    spawn('rails', 'db', '-p', in: r)
    w.write(IO.read(file))
    w.close
    sleep 2
    TranslationValue.last.touch
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
      workflow_state: 'public',
      registry_name_types: [
        RegistryNameType.create(
          code: 'spelling',
          name: 'Bezeichner',
          order_priority: 3
        ),
        RegistryNameType.create(
          code: 'ancient',
          name: 'Ehemalige Bezeichnung',
          order_priority: 3
        )
      ],
    )

    Project.create! attribs
  end

  def self.project_with_contribution_types_and_metadata_fields
    project = test_project(
      shortname: ('a'..'z').to_a.shuffle[0,4].join,
    )

    %w(interviewee interviewer translator transcriptor research cinematographer).each do |code|
      use_in_export = code != 'interviewee'
      ContributionType.create(project: project, code: code, use_in_export: use_in_export)
    end

    places = RegistryEntry.create! code: 'places', project: project, workflow_state: 'public'

    {
      birth_location: 'Geburtsort',
      interview_location: 'Interviewort'
    }.each do |code, name|
      registry_reference_type = RegistryReferenceType.create!(
        registry_entry: places,
        project: project,
        name: name,
        code: code
      )
      MetadataField.create!(
        registry_reference_type: registry_reference_type,
        ref_object_type: code == :birth_location ? 'Person' : 'Interview',
        source: 'RegistryReferenceType',
        project: project,
        use_in_metadata_import: true,
        label: name,
        name: code
      )
    end
    RegistryNameType.create(
      code: "spelling",
      name: "Bezeichner",
      project: project
    )
    project
  end

  def self.interview_with_everything(project, archive_id_number)
    attributes = {
      archive_id: "#{project.shortname}#{format('%03d', archive_id_number)}",
      media_type: 'video',
      observations: '1\nInternational Slave- und Forced Labourers Documentation Project – Internationales Sklaven- und Zwangsarbeiter Befragungsprojekt\nInterview mit Adamez Konstantin Wojtowitsch\nProtokoll\nAudiointerview am 10. September 2005 in Minsk \t\n(Weißrussland/Belarus)\nAdresse: Wohnung von Adamez Konstantin Wojtowitsch',
      description: 'an einem Sonntag ...',
      collection: Collection.create!(name: 'Test collection', project: project),
      properties: {link: 'http://bla.de'},
      interview_date: '2.3.1978',
      signature_original: 'karlheinz23',
    }

    interview = Interview.create!(
      attributes.merge(
        project: project,
        interview_languages: [
          InterviewLanguage.new(
            language: Language.create!(code: 'rus', name: 'Russisch', locale: 'de'),
            spec: 'primary'
          ),
          InterviewLanguage.new(
            language: Language.create!(code: 'pol', name: 'Polnisch', locale: 'de'),
            spec: 'secondary'
          ),
          InterviewLanguage.new(
            language: Language.create!(code: 'ger', name: 'Deutsch', locale: 'de'),
            spec: 'primary_translation'
          )
        ],
      )
    )

    person = person_with_biographical_entries(project)

    {interviewer: 'INT', interviewee: 'AB', cinematographer: 'KAM'}.each do |code, speaker_designation|
      #contribution_type = ContributionType.create!(
        #code: code,
        #project: project
      #)
      Contribution.create!(
        interview: interview,
        speaker_designation: speaker_designation,
        person: person,
        contribution_type_id: ContributionType.find_by(code: code, project: project).id
      )
    end

    photo = photo_with_translation(interview)

    first_tape = Tape.create(interview: interview, number: 1)
    second_tape = Tape.create(interview: interview, number: 2)

    first_speaker = interview.contributions.first.person
    second_speaker = interview.contributions.first(2).last.person

    germany = registry_entry_with_names(project)
    france = registry_entry_with_names(project, {de: 'Frankreich', ru: 'Фра́нция'})
    poland = registry_entry_with_names(project, {de: 'Polen', ru: 'По́льша'})

    segment_with_everything(
      "00:00:02.00",
      interview,
      first_tape,
      first_speaker,
      [{
        locale: :ru,
        text: "Итак, сегодня 10-ое сентября 2005-го года, и мы находимся в гостях у Константина Войтовича Адамца",
        mainheading: "Вступление",
        subheading: nil
      }, {
        locale: :de,
        text: "Also gut, heute ist der 10. September 2005, und wir sind bei Konstantin Woitowitsch Adamez",
        mainheading: "Einleitung",
        subheading: nil,
      }],
      [germany],
      [
        {
          locale: :de,
          text: "Hauptsitz Berlin Filiale für die Eisenerzgewinnung in Elsass-Lothringen",
        },
        {
          locale: :ru,
          text: "Главное местонахождение — Берлин Филиал по добыче"
        }
      ]
    )
    segment_with_everything(
      "00:02:02.00",
      interview,
      second_tape,
      second_speaker,
      [{
        locale: :ru,
        text: "И, я бы попросил Вас, Константин Войтович, расскажите, пожалуйста, историю Вашей жизни",
        mainheading: nil,
        subheading: "жизнь"
      }, {
        locale: :de,
        text: "Und ich würde Sie bitten, Konstantin Woitowitsch, erzählen Sie bitte Ihre Lebensgeschichte",
        mainheading: nil,
        subheading: "Leben",
      }],
      [france, poland],
      [
        {
          locale: :de,
          text: "Für die Unterbringung der Ostarbeiter errichtetes Barackenlager"
        },
        {
          locale: :ru,
          text: "Построенный для размещения восточных рабочих барачный"
        }
      ]
    )
    interview
  end

  def self.segment_with_everything(
    timecode="00:00:02.00",
    interview=test_interview,
    tape=test_tape,
    speaker=nil,
    translations_attributes=[
      {
        locale: :de,
        text: 'Am Anfang, also das war...',
        mainheading: 'Anfang',
        subheading: 'Morgens'
      },
      {
        locale: :en,
        text: 'In the begining, it was...',
        mainheading: 'Beginning',
        subheading: 'In the morning'
      }
    ],
    registry_entries=[],
    annotations=[
      {
        text: 'Für die Unterbringung der Ostarbeiter errichtetes Barackenlager',
        locale: :de
      },
      {
        text: 'Построенный для размещения восточных рабочих барачный',
        locale: :ru
      }]
  )
    segment = Segment.create(
      interview: interview,
      tape: tape,
      timecode: timecode,
      speaking_person: speaker,
      translations_attributes: translations_attributes,
      registry_references_attributes: registry_entries.map { |entry| {registry_entry: entry} },
      annotations: annotations.map { |annotation| Annotation.new(annotation) }
    )
  end

  def self.test_tape(interview, number=1)
    Tape.create(interview: interview, number: number)
  end

  def self.registry_entry_with_names(project, names={de: 'Deutschland', ru: 'Герма́ния'})
    registry_entry = RegistryEntry.create(
      latitude: 52.52,
      longitude: 13.40,
      workflow_state: "public",
      list_priority: 0,
      project: project,
    )
    RegistryName.create(
      registry_entry: registry_entry,
      name_position: 1,
      registry_name_type: project.registry_name_types.first,
      translations_attributes: names.map { |locale, name| {
        locale: locale,
        descriptor: name,
      } }
    )
    registry_entry
  end

  def self.photo_with_translation(interview)
    photo = Photo.create(
      interview: interview,
      workflow_state: "public",
      public_id: 'cd001_33',
      photo_file_name: 'cd001_33.jpg',
      photo_content_type: 'image/jpeg',
      translations_attributes: [
        {
          locale: "de",
          caption: "Ein Haus am See",
          date: '1.5.1999',
          place: 'Berlin',
          photographer: 'Hubert',
          license: 'GPL',
        }
      ]
      #file: File.open(Rails.root.join('spec', 'fixtures', 'files', 'photo.jpg')),
    )
    photo.photo.attach(io: File.open(Rails.root.join('spec', 'files', 'cd001_33.jpg')), filename: 'cd001_33.jpg', content_type: 'image/jpeg')
  end

  def self.person_with_biographical_entries(project)
    entries = [
      [:de, "15.09.1925: Geburt im Dorf Stasi, Bez. Dikanka, Gebiet Poltawa. Konstantin Wojtowitsch hat vier Geschwister"],
      [:ru, "Адамец Константин Войтович родился 15.09.1925 г. в деревне Стаси Диканьского района Полтавской области. У Константина Войтовича было три брата и одна сестр"]
    ]
    person = Person.create(
      first_name: "Константин",
      last_name: "Адамец",
      birth_name: "Hans",
      other_first_names: "Войтович",
      alias_names: "Адамец Константин Войтович Adamez Konstantin",
      biographical_entries_attributes: entries.map { |locale, text| {locale: locale, text: text} },
      project: project,
      gender: 'male'
    )
    person.update(
      locale: 'de',
      first_name: 'Konstantin',
      last_name: 'Adamez',
      birth_name: 'Hans',
      other_first_names: 'Wojtowitsch',
      alias_names: 'Адамец Константин Войтович Adamez Konstantin',
      pseudonym_first_name: 'Max',
      pseudonym_last_name: 'Huber',
      description: 'Max ist ein freundlicher Mensch',
    )
    person
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
        ),
        Contribution.new(
          contribution_type: ContributionType.find_by!(code: 'interviewee'),
          person: Person.find_by!(last_name: 'Dupont')
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
