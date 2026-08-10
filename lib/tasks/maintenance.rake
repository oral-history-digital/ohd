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

  desc "create default data for projects (except ohd) (if not already present)"
  task create_default_data: :environment do
    Project.where.not(shortname: 'ohd').each do |project|
      $current_project = project
      Rake::Task['roles:create_permissions'].invoke
      Rake::Task['roles:create_default_roles_and_permissions'].invoke
      Rake::Task['maintenance:create_default_interviewee_metadata_fields'].invoke
      Rake::Task['maintenance:create_default_interview_metadata_fields'].invoke
      Rake::Task['maintenance:create_default_contribution_types'].invoke
      Rake::Task['maintenance:create_default_task_types'].invoke
      Rake::Task['maintenance:create_default_texts'].invoke
      Rake::Task['maintenance:create_default_landing_page_texts'].invoke
      Rake::Task['maintenance:create_default_media_streams'].invoke
    end
  end

  desc "create default interviewee metadata fields (if not already present)"
  task create_default_interviewee_metadata_fields: :environment do
    project = $current_project
    YAML.load_file(File.join(Rails.root, 'config/defaults/interviewee_metadata_fields.yml')).each do |(name, settings)|
      metadata_field = MetadataField.create(
        project_id: project.id,
        name: name,
        source: 'Person',
        use_as_facet: settings['use_as_facet'] || false,
        use_in_results_table: settings['use_in_results_table'] || false,
        use_in_results_list: settings['use_in_results_list'] || false,
        use_in_details_view: settings['use_in_details_view'] || false,
        use_in_metadata_import: settings['use_in_metadata_import'] || false,
        display_on_landing_page: settings['display_on_landing_page'] || false,
        use_in_map_search: settings['use_in_map_search'] || false,
        list_columns_order: settings['list_columns_order'] || 1.0,
        facet_order: settings['facet_order'] || 1.0
      )

      add_translations(metadata_field, 'label', "metadata_labels.#{name}")
    end
  end

  task create_default_interview_metadata_fields: :environment do
    project = $current_project
    YAML.load_file(File.join(Rails.root, 'config/defaults/interview_metadata_fields.yml')).each do |(name, settings)|
      metadata_field = MetadataField.create(
        project_id: project.id,
        name: name,
        source: 'Interview',
        use_as_facet: settings['use_as_facet'] || false,
        use_in_results_table: settings['use_in_results_table'] || false,
        use_in_results_list: settings['use_in_results_list'] || false,
        use_in_details_view: settings['use_in_details_view'] || false,
        use_in_metadata_import: settings['use_in_metadata_import'] || false,
        display_on_landing_page: settings['display_on_landing_page'] || false,
        use_in_map_search: settings['use_in_map_search'] || false,
        list_columns_order: settings['list_columns_order'] || 1.0,
        facet_order: settings['facet_order'] || 1.0
      )

      add_translations(metadata_field, 'label', "metadata_labels.#{name}")
    end
  end

  task create_default_contribution_types: :environment do
    project = $current_project
    YAML.load_file(File.join(Rails.root, 'config/defaults/contribution_types.yml')).each do |(code, settings)|
      contribution_type = ContributionType.create(
        code: code,
        project_id: project.id,
        use_in_details_view: settings['use_in_details_view'] || false,
        use_in_export: settings['use_in_export'] || false,
      )

      add_translations(contribution_type, 'label', "contributions.#{code}")
    end
  end

  task create_default_task_types: :environment do
    project = $current_project
    YAML.load_file(File.join(Rails.root, 'config/defaults/task_types.yml')).each do |task_type_settings|
      task_type = TaskType.create(
        **task_type_settings[:attributes][0],
        project_id: project.id,
        use: true
      )
      task_type_settings[:permissions].each do |permission|
        perm = Permission.find_or_create_by(klass: permission[:klass], action_name: permission[:action_name])
        perm.update_attribute(:name, "#{permission[:klass]} #{permission[:action_name]}")
        TaskTypePermission.find_or_create_by(task_type_id: task_type.id, permission_id: perm.id)
      end
    end
  end

  task create_default_texts: :environment do
    project = $current_project
    %w(conditions contact legal_info).each do |code|
      I18n.available_locales.each do |locale|
        text = Text.find_or_initialize_by(
          project_id: project.id,
          code: code
        )
        text.update(
          locale: locale,
          text: replace_with_project_params(
            File.read(File.join(Rails.root, "config/defaults/texts/#{locale}/#{code}.html")),
            {
              privacy_protection_link: "#{OHD_DOMAIN}/#{locale}/privacy_protection",
              project_conditions_link: "#{project.domain_with_optional_identifier}/#{locale}/conditions",
              ohd_conditions_link: "#{OHD_DOMAIN}/#{locale}/conditions",
            }
          )
        )
      end
    end
  end

  task create_default_landing_page_texts: :environment do
    project = $current_project
    landing_page_texts = {
      de: 'Das Interview mit INTERVIEWEE ist Teil des Online-Archivs „ARCHIVE_TITLE“. Um Zugang zu den vollständigen Interviews mit Transkript und weiteren Materialien zu erhalten, müssen Sie sich in der Plattform "Oral-History.Digital" registrieren und Ihre Freischaltung für das Archiv "ARCHIVE_TITLE" beantragen. Bitte beachten Sie die Nutzungsbedingungen, insbesondere die Persönlichkeitsrechte der Interviewten.',
      en: 'The interview with INTERVIEWEE is part of the online archive “ARCHIVE_TITLE.” To access the complete interviews with transcripts and additional materials, you must register on the “Oral-History.Digital” platform and apply for access to the “ARCHIVE_TITLE” archive. Please note the terms of use, particularly with regard to the personal rights of the interviewees.',
      ru: 'The interview with INTERVIEWEE is part of the online archive “ARCHIVE_TITLE.” To access the complete interviews with transcripts and additional materials, you must register on the “Oral-History.Digital” platform and apply for access to the “ARCHIVE_TITLE” archive. Please note the terms of use, particularly with regard to the personal rights of the interviewees.',
      es: 'The interview with INTERVIEWEE is part of the online archive “ARCHIVE_TITLE.” To access the complete interviews with transcripts and additional materials, you must register on the “Oral-History.Digital” platform and apply for access to the “ARCHIVE_TITLE” archive. Please note the terms of use, particularly with regard to the personal rights of the interviewees.',
      el: 'The interview with INTERVIEWEE is part of the online archive “ARCHIVE_TITLE.” To access the complete interviews with transcripts and additional materials, you must register on the “Oral-History.Digital” platform and apply for access to the “ARCHIVE_TITLE” archive. Please note the terms of use, particularly with regard to the personal rights of the interviewees.',
      uk: 'The interview with INTERVIEWEE is part of the online archive “ARCHIVE_TITLE.” To access the complete interviews with transcripts and additional materials, you must register on the “Oral-History.Digital” platform and apply for access to the “ARCHIVE_TITLE” archive. Please note the terms of use, particularly with regard to the personal rights of the interviewees.',
      ar: 'The interview with INTERVIEWEE is part of the online archive “ARCHIVE_TITLE.” To access the complete interviews with transcripts and additional materials, you must register on the “Oral-History.Digital” platform and apply for access to the “ARCHIVE_TITLE” archive. Please note the terms of use, particularly with regard to the personal rights of the interviewees.'
    }
    restricted_landing_page_texts = {
      de: 'Aus rechtlichen oder ethischen Gründen ist dieses Interview nur beschränkt zugänglich. Bitte beantragen Sie den erweiterten Zugang per E-Mail.',
      en: 'For legal or ethical reasons, this interview is only accessible on request. Please request extended access via e-mail.',
      ru: 'По юридическим или этическим причинам это интервью доступно только по запросу. Пожалуйста, подайте заявку на расширенный доступ via e-mail.',
      es: 'Por razones legales o éticas, esta entrevista sólo es accesible previa solicitud. Por favor, solicite acceso ampliado via e-mail.',
      el: 'Για νομικούς ή δεοντολογικούς λόγους, η συνέντευξη αυτή είναι προσβάσιμη μόνο κατόπιν αιτήματος. Παρακαλείστε να υποβάλετε αίτηση για εκτεταμένη πρόσβαση via e-mail.',
      uk: "З юридичних та етичних причин це інтерв'ю доступне лише за запитом. Будь ласка, подайте заявку на розширений доступ via e-mail.",
      ar: "بسبب أسباب قانونية أو أخلاقية، هذه المقابلة متاحة فقط مع قيود. يرجى طلب الوصول الموسع عبر البريد الإلكتروني'"
    }

    project.available_locales.each do |locale|
      project.update(
        landing_page_text: landing_page_texts[locale.to_sym],
        restricted_landing_page_text: restricted_landing_page_texts[locale.to_sym],
        locale: locale
      )
    end
  end

  task create_default_media_streams: :environment do
    project = $current_project
    YAML.load_file(File.join(Rails.root, 'config/defaults/media_streams.yml')).each do |(name, settings)|
      MediaStream.create(
        project_id: project.id,
        media_type: settings['media_type'],
        path: settings['path'].sub('SHORTNAME', project.shortname),
        resolution: settings['resolution'],
      )
    end
  end

  private

  def add_translations(record, attribute, translation_key)
    project.available_locales.each do |locale|
      if TranslationValue.available?(translation_key, locale)
        record.update("#{attribute}": TranslationValue.for(translation_key, locale), locale: locale)
      end
    end
  end
end
