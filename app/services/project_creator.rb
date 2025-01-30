class ProjectCreator < ApplicationService
  attr_accessor :project_params, :user, :project, :default_registry_name_type,
    :root_registry_entry, :is_ohd

  def initialize(project_params, user, is_ohd = false)
    @project_params = project_params.merge(
      archive_id_number_length: 4,
      has_map: true,
    )
    @user = user
    @is_ohd = is_ohd
  end

  def perform(*args)
    @project = Project.create(project_params)
    grant_access_to_creating_user
    create_default_registry_name_types
    create_root_registry_entry
    create_default_registry_entries
    create_default_registry_reference_types
    create_default_registry_reference_type_metadata_fields
    # create_default_event_types  # Do not create default event types for now.
    create_default_interviewee_metadata_fields
    create_default_interview_metadata_fields
    create_default_contribution_types unless is_ohd
    create_default_roles
    create_default_task_types unless is_ohd
    create_default_texts
    create_default_media_streams
    project.update(
      upload_types: ["bulk_metadata", "bulk_texts", "bulk_registry_entries", "bulk_photos"]
    ) unless is_ohd
    project
  end

  private

  def grant_access_to_creating_user#(project, user)
    user_project = UserProject.create(
      project_id: project.id,
      user_id: user.id
    )
    user_project.grant_project_access!
  end

  def create_default_registry_name_types
    {
      spelling: 'Bezeichner',
      ancient: 'Alias oder ehemalige Bezeichnung'
    }.each do |code, name|
      RegistryNameType.create(
        code: code,
        name: name,
        order_priority: 3,
        project_id: project.id
      )
    end
  end

  def default_registry_name_type
    @default_registry_name_type ||= RegistryNameType.where(
      code: "spelling",
      project_id: project.id
    ).first
  end

  def create_root_registry_entry
    @root_registry_entry = RegistryEntry.create(
      project_id: project.id,
      code: 'root',
      workflow_state: 'public'
    )
    RegistryName.create(
      registry_entry_id: root_registry_entry.id,
      registry_name_type_id: default_registry_name_type.id,
      name_position: 0,
      descriptor: TranslationValue.for('registry', project.default_locale),
      locale: project.default_locale
    )
  end

  def create_default_registry_entries
    %w(places people subjects).each do |code|
      entry = RegistryEntry.create(
        project_id: project.id,
        code: code,
        workflow_state: 'public'
      )

      registry_name = RegistryName.create(
        registry_entry_id: entry.id,
        registry_name_type_id: default_registry_name_type.id,
        name_position: 0,
      )

      add_translations(registry_name, 'descriptor', code)

      RegistryHierarchy.find_or_create_by(
        ancestor_id: root_registry_entry.id,
        descendant_id: entry.id
      )
    end
  end

  def create_default_registry_reference_types
    %w(birth_location home_location interview_location subjects).each do |code|
      registry_entry_code = code == 'subjects' ? 'subjects' : 'places'
      ref_type = RegistryReferenceType.create(
        code: code,
        registry_entry_id: project.registry_entries.where(code: registry_entry_code).first.id,
        project_id: project.id,
        use_in_transcript: true,
      )

      add_translations(ref_type, 'name', "registry_reference_types.#{code}")
    end
  end

  def create_default_event_types
    %w(date_of_birth).each do |code|
      event_type = EventType.create(
        code: code,
        project_id: project.id
      )

      add_translations(event_type, 'name', "event_types.#{code}")
    end
  end

  def create_default_registry_reference_type_metadata_fields
    YAML.load_file(File.join(Rails.root, 'config/defaults/registry_reference_type_metadata_fields.yml')).each do |(name, settings)|
      metadata_field = MetadataField.create(
        registry_reference_type_id: (settings['ohd'] ? Project.ohd : project).registry_reference_types.where(code: name).first.id,
        project_id: project.id,
        name: name,
        source: 'RegistryReferenceType',
        ref_object_type: settings['ref_object_type'],
        use_as_facet: settings['use_as_facet'] || false,
        use_in_results_table: settings['use_in_results_table'] || false,
        use_in_results_list: settings['use_in_results_list'] || false,
        use_in_details_view: settings['use_in_details_view'] || false,
        use_in_metadata_import: settings['use_in_metadata_import'] || false,
        display_on_landing_page: settings['display_on_landing_page'] || false,
        use_in_map_search: settings['use_in_map_search'] || false,
        map_color: settings['map_color'] || '#1c2d8f',
        list_columns_order: settings['list_columns_order'] || 1.0,
        facet_order: settings['facet_order'] || 1.0
      )

      add_translations(metadata_field, 'label', "metadata_labels.#{name}")
    end
  end

  def create_default_interviewee_metadata_fields
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

  def create_default_interview_metadata_fields
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

  def create_default_contribution_types
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

  def create_default_task_types
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

  def create_default_roles
    YAML.load_file(File.join(Rails.root, 'config/defaults/roles.yml')).each do |role_permission|
      role = Role.find_or_create_by(name: role_permission[:name], project_id: project.id)
      role_permission[:permissions].each do |permission|
        perm = Permission.find_or_create_by(klass: permission[:klass], action_name: permission[:action_name])
        perm.update_attribute(:name, "#{permission[:klass]} #{permission[:action_name]}")
        RolePermission.find_or_create_by(role_id: role.id, permission_id: perm.id)
      end
    end
  end

  def create_default_texts
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
              #project_name: project.name(locale),
              #project_manager: project.manager,
              #project_contact_email: project.contact_email,
              #project_leader: project.leader,
              #institution_name: project.institutions.first&.name(locale),
              #institution_shortname: project.institutions.first&.shortname,
              #institution_website: project.institutions.first&.website,
              #institution_street: project.institutions.first&.street,
              #institution_zip: project.institutions.first&.zip,
              #institution_city: project.institutions.first&.city,
              #institution_country: project.institutions.first&.country,
              privacy_protection_link: "#{OHD_DOMAIN}/#{locale}/privacy_protection",
              project_conditions_link: "#{project.domain_with_optional_identifier}/#{locale}/conditions",
              ohd_conditions_link: "#{OHD_DOMAIN}/#{locale}/conditions",
            }
          )
        )
      end
    end
  end

  def create_default_media_streams
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
      record.update("#{attribute}": TranslationValue.for(translation_key, locale), locale: locale)
    end
  end

  def replace_with_project_params(text, params)
    params.each do |key, value|
      text.gsub!("%{#{key}}", value) if value
    end
    text
  end

end
