class ProjectCreator < ApplicationService
  attr_accessor :project_params, :user, :project, :default_registry_name_type,
    :root_registry_entry, :is_ohd

  def initialize(project_params, user, is_ohd = false)
    @project_params = project_params
    @user = user
    @is_ohd = is_ohd
  end

  def perform(*args)
    @project = Project.create(project_params)
    grant_access_to_creating_user
    create_default_registry_name_types
    create_root_registry_entry
    create_default_registry_entries
    create_default_registry_reference_types unless is_ohd
    create_default_registry_reference_type_metadata_fields unless is_ohd
    create_default_event_types unless is_ohd
    create_default_interviewee_metadata_fields unless is_ohd
    create_default_interview_metadata_fields unless is_ohd
    create_default_contribution_types unless is_ohd
    create_default_task_types unless is_ohd
    create_default_roles
    project.update(
      upload_types: ["bulk_metadata", "bulk_texts", "bulk_registry_entries", "bulk_photos"]
    ) unless is_ohd
    project
  end

  private

  def grant_access_to_creating_user#(project, user)
    user_registration_project = UserRegistrationProject.create(
      project_id: project.id,
      user_registration_id: user.user_registration.id
    )
    user_registration_project.grant_project_access!
  end

  def create_default_registry_name_types
    {
      spelling: 'Bezeichner',
      ancient: 'Ehemalige Bezeichnung'
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
      descriptor: I18n.t('registry', locale: project.default_locale),
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
    %w(birth_location home_location interview_location).each do |code|
      ref_type = RegistryReferenceType.create(
        code: code,
        registry_entry_id: project.registry_entries.where(code: 'places').first.id,
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
        registry_reference_type_id: project.registry_reference_types.where(code: name).first.id,
        project_id: project.id,
        name: name,
        source: 'RegistryReferenceType',
        ref_object_type: settings['ref_object_type'],
        use_as_facet: settings['use_as_facet'] || false,
        use_in_results_table: settings['use_in_results_table'] || false,
        use_in_results_list: settings['use_in_results_list'] || false,
        use_in_details_view: settings['use_in_details_view'] || false,
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
        display_on_landing_page: settings['display_on_landing_page'] || false,
        use_in_map_search: settings['use_in_map_search'] || false,
        list_columns_order: settings['list_columns_order'] || 1.0,
        facet_order: settings['facet_order'] || 1.0
      )

      add_translations(metadata_field, 'label', "metadata_labels.#{name}")
    end
  end

  def create_default_contribution_types
    YAML.load_file(File.join(Rails.root, 'config/defaults/contribution_types.yml')).each do |code|
      contribution_type = ContributionType.create(
        code: code,
        project_id: project.id,
      )

      add_translations(contribution_type, 'label', "contributions.#{code}")
    end
  end

  def create_default_task_types
    YAML.load_file(File.join(Rails.root, 'config/defaults/task_types.yml')).each do |key, (label, abbreviation)|
      TaskType.create(
        key: key,
        label: label,
        abbreviation: abbreviation,
        project_id: project.id,
        use: true
      )
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

  private

  def add_translations(record, attribute, translation_key)
    project.available_locales.each do |locale|
      I18n.locale = locale
      record.send("#{attribute}=", I18n.t(translation_key))
    end
    record.save
    I18n.locale = project.default_locale
  end

end
