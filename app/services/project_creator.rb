class ProjectCreator < ApplicationService
  attr_accessor :project_params, :user, :project, :default_registry_name_type,
    :root_registry_entry

  def initialize(project_params, user)
    @project_params = project_params
    @user = user
  end

  def perform(*args)
    @project = Project.create(project_params)
    grant_access_to_creating_user
    create_default_registry_name_type
    create_root_registry_entry
    create_default_registry_entries
    create_default_registry_reference_types
    create_default_registry_reference_type_metadata_fields
    create_default_interviewee_metadata_fields
    create_default_interview_metadata_fields
    create_default_contribution_types
    create_default_task_types
    create_default_roles
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

  def create_default_registry_name_type
    @default_registry_name_type = RegistryNameType.create(
      code: "spelling",
      name: "Bezeichner",
      order_priority: 3,
      project_id: project.id
    )
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
    %w(place people subjects).each do |code|
      entry = RegistryEntry.create(
        project_id: project.id,
        code: code,
        workflow_state: 'public'
      )

      locales = [project.default_locale, 'en'] & project.available_locales
      locales.each do |locale|
        RegistryName.create(
          registry_entry_id: entry.id,
          registry_name_type_id: default_registry_name_type.id,
          name_position: 0,
          descriptor: I18n.t(code, locale: locale),
          locale: locale
        )
      end

      RegistryHierarchy.find_or_create_by(
        ancestor_id: root_registry_entry.id,
        descendant_id: entry.id
      )
    end
  end

  def create_default_registry_reference_types
    %w(birh_location home_location interview_location).each do |code|
      RegistryReferenceType.create(
        code: code,
        registry_entry_id: project.registry_entries.where(code: 'place').first.id,
        project_id: project.id,
        name: code.humanize,
        locale: project.default_locale
      )
    end
  end

  def create_default_registry_reference_type_metadata_fields
    {
      birh_location: 'Person',
      home_location: 'Person',
      interview_location: 'Interview'
    }.each_with_index do |(code, ref_object_type), index|
      MetadataField.create(
        registry_reference_type_id: project.registry_reference_types.where(code: code).first.id,
        project_id: project.id,
        name: code,
        ref_object_type: ref_object_type,
        source: 'RegistryReferenceType',
        label: code.to_s.humanize,
        locale: project.default_locale,
        use_as_facet: true,
        use_in_results_table: true,
        use_in_details_view: true,
        display_on_landing_page: true,
        list_columns_order: index,
        facet_order: index
      )
    end
  end

  def create_default_interviewee_metadata_fields
    {
      date_of_birth: false,
      year_of_birth: false,
      gender: true,
    }.each_with_index do |(name, use_as_facet), index|
      MetadataField.create(
        project_id: project.id,
        name: name,
        source: 'Person',
        label: name.to_s.humanize,
        locale: project.default_locale,
        use_as_facet: true,
        use_in_results_table: true,
        use_in_details_view: true,
        display_on_landing_page: true,
        list_columns_order: index,
        facet_order: index
      )
    end
  end

  def create_default_interview_metadata_fields
    YAML.load_file(File.join(Rails.root, 'config/interview_metadata_fields.yml')).each_with_index do |(name, use_as_facet), index|
      MetadataField.create(
        project_id: project.id,
        name: name,
        source: 'Interview',
        label: name.to_s.humanize,
        locale: project.default_locale,
        use_as_facet: true,
        use_in_results_table: true,
        use_in_details_view: true,
        display_on_landing_page: true,
        list_columns_order: index,
        facet_order: index
      )
    end
  end

  def create_default_contribution_types
    YAML.load_file(File.join(Rails.root, 'config/contribution_types.yml')).each do |code|
      ContributionType.create(
        code: code,
        project_id: project.id,
        label: I18n.t("contributions.#{code}", locale: project.default_locale),
        locale: project.default_locale
      )
    end
  end

  def create_default_task_types
    YAML.load_file(File.join(Rails.root, 'config/task_types.yml')).each do |key, (label, abbreviation)|
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
    YAML.load_file(File.join(Rails.root, 'config/roles.yml')).each do |role_permission|
      role = Role.find_or_create_by(name: role_permission[:name], project_id: project.id)
      role_permission[:permissions].each do |permission|
        perm = Permission.find_or_create_by(klass: permission[:klass], action_name: permission[:action_name])
        perm.update_attribute(:name, "#{permission[:klass]} #{permission[:action_name]}")
        RolePermission.find_or_create_by(role_id: role.id, permission_id: perm.id)
      end
    end
  end

end
