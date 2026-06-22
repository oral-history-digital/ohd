namespace :bootstrap do
  module Helpers
    module_function

    def value_from(args, key, env_key, default: nil, required: false)
      """
      Fetch a value from rake args or environment variables, with optional default and required flag.
      Precedence: rake arg > ENV > default.
      """
      value = args[key] || ENV[env_key] || default
      value = value.strip if value.is_a?(String)

      if required && value.blank?
        raise ArgumentError, "Missing required value '#{key}'. Provide rake arg or ENV #{env_key}."
      end

      value
    end

    def invoke_task(task_name, *task_args)
      task = Rake::Task[task_name]
      task.reenable
      task.invoke(*task_args)
    end

    def ensure_language(code, label)
      """
      Find or create a Language record with the given code and label.
      If the record already exists, it will not update the label unless it's blank.
      """
      language = Language.find_or_initialize_by(code: code)
      language.label = label if language.respond_to?(:label=) && language.label.blank?
      language.save!
    end

    def ensure_root_registry_entry(project)
      """
      Find or create the root RegistryEntry for the given project.
      The root entry is identified by code 'root' and is the top-level entry in the registry hierarchy.
      """
      root_entry = project.registry_entries.find_or_initialize_by(code: 'root')
      root_entry.workflow_state ||= 'public'
      root_entry.save!
      root_entry.translations.find_or_create_by!(locale: project.default_locale.presence || 'en')
      root_entry
    end

    def ensure_admin_user!(project:, email:, password:, first_name:, last_name:, locale: 'en')
      """
      Find or create an admin User for the given project.
      If the user already exists, it will update the attributes unless they are already set.
      """
      user = User.find_or_initialize_by(email: email)
      user.login = email if user.respond_to?(:login=)
      user.first_name = first_name
      user.last_name = last_name
      user.default_locale ||= locale
      user.street ||= 'Bootstrap Street 1'
      user.city ||= 'Berlin'
      user.country ||= 'Germany'
      user.tos_agreement = true
      user.priv_agreement = true
      user.tos_agreed_at ||= Time.current
      user.confirmed_at ||= Time.current
      user.admin = true

      user.password = password
      user.password_confirmation = password

      user.save!

      user_project = UserProject.find_or_initialize_by(user: user, project: project)
      user_project[:workflow_state] ||= 'project_access_granted'
      user_project.activated_at ||= Time.current
      user_project.processed_at ||= Time.current
      user_project.tos_agreement = true if user_project.respond_to?(:tos_agreement=)
      user_project.save!

      user
    end

    def ensure_project!(shortname:, archive_domain:, locale:, admin_email:)
      """
      Find or create a Project with the given shortname and attributes.
      If the project already exists, it will update the attributes unless they are already set.
      """
      project = Project.find_or_initialize_by(shortname: shortname)

      # Keep project defaults explicit so repeated runs converge on the same baseline.
      project.domain = archive_domain if project.respond_to?(:domain=)
      project.archive_domain = archive_domain
      project.available_locales = [locale]
      project.default_locale = locale
      project.workflow_state ||= 'public'
      project.contact_email = admin_email if project.respond_to?(:contact_email=)
      project.view_modes = %w[grid list] if project.respond_to?(:view_modes=)
      project.primary_color ||= '#336699' if project.respond_to?(:primary_color=)
      project.secondary_color ||= '#660033' if project.respond_to?(:secondary_color=)
      project.name = shortname.upcase if project.respond_to?(:name=) && project.name.blank?
      project.introduction ||= "#{shortname.upcase} archive" if project.respond_to?(:introduction=)
      project.save!

      ensure_root_registry_entry(project)

      institution = Institution.find_or_initialize_by(shortname: "#{shortname}-institution")
      institution.name = "#{shortname.upcase} Institution" if institution.respond_to?(:name=) && institution.name.blank?
      institution.save!

      InstitutionProject.find_or_create_by!(project: project, institution: institution)

      project
    end
  end

  desc 'Create global baseline records used by fresh instances'
  task system_defaults: :environment do
    Helpers.ensure_language('de', 'Deutsch')
    Helpers.ensure_language('en', 'English')

    Helpers.invoke_task('roles:create_permissions')
    Helpers.invoke_task('roles:create_default_roles_and_permissions')
    Helpers.invoke_task('translations:import')

    puts 'Bootstrap system defaults complete'
  end

  desc 'Create/update one tenant and a confirmed admin user (args: shortname,archive_domain,admin_email,admin_password,admin_first_name,admin_last_name,locale)'
  task :tenant,
       [:shortname, :archive_domain, :admin_email, :admin_password, :admin_first_name, :admin_last_name, :locale] => :environment do |_t, args|
    shortname = Helpers.value_from(args, :shortname, 'BOOTSTRAP_PROJECT_SHORTNAME', required: true)
    archive_domain = Helpers.value_from(args, :archive_domain, 'BOOTSTRAP_ARCHIVE_DOMAIN', required: true)
    archive_domain = archive_domain.sub(%r{/+\z}, '') # normalize trailing slashes
    admin_email = Helpers.value_from(args, :admin_email, 'BOOTSTRAP_ADMIN_EMAIL', required: true)
    admin_password = Helpers.value_from(args, :admin_password, 'BOOTSTRAP_ADMIN_PASSWORD', default: 'ChangeMe123!')
    admin_first_name = Helpers.value_from(args, :admin_first_name, 'BOOTSTRAP_ADMIN_FIRST_NAME', default: 'Admin')
    admin_last_name = Helpers.value_from(args, :admin_last_name, 'BOOTSTRAP_ADMIN_LAST_NAME', default: 'Istrator')
    locale = Helpers.value_from(args, :locale, 'BOOTSTRAP_DEFAULT_LOCALE', default: 'en')

    project = Helpers.ensure_project!(
      shortname: shortname,
      archive_domain: archive_domain,
      locale: locale,
      admin_email: admin_email
    )

    Helpers.ensure_admin_user!(
      project: project,
      email: admin_email,
      password: admin_password,
      first_name: admin_first_name,
      last_name: admin_last_name,
      locale: locale
    )

    Helpers.invoke_task('task_types:create_default_task_types_and_permissions', project.shortname)

    puts "Bootstrap tenant complete (project=#{project.shortname}, admin=#{admin_email})"
  end

  desc 'Run basic checks for bootstrap-created records (optionally for one shortname)'
  task :verify, [:shortname] => :environment do |_t, args|
    shortname = Helpers.value_from(args, :shortname, 'BOOTSTRAP_PROJECT_SHORTNAME')

    if shortname.present?
      project = Project.find_by(shortname: shortname)
      raise "Missing project '#{shortname}'" if project.blank?

      raise "Missing root registry entry for project '#{shortname}'" unless project.registry_entries.where(code: 'root').exists?
      raise "Missing task types for project '#{shortname}'" if project.task_types.count.zero?
      raise "Missing user link for project '#{shortname}'" if UserProject.where(project_id: project.id).count.zero?
    else
      raise "Missing baseline project 'ohd'" if Project.find_by(shortname: 'ohd').blank?
      raise 'Missing TranslationValue records' if TranslationValue.count.zero?
      raise 'Missing Role records' if Role.count.zero?
      raise 'Missing Permission records' if Permission.count.zero?
    end

    puts 'Bootstrap verify passed'
  end

  desc 'Run full bootstrap flow (global defaults + tenant + verification)'
  task :all,
       [:shortname, :archive_domain, :admin_email, :admin_password, :admin_first_name, :admin_last_name, :locale] => :environment do |_t, args|
    Helpers.invoke_task('bootstrap:system_defaults')

    Helpers.invoke_task(
      'bootstrap:tenant',
      args[:shortname],
      args[:archive_domain],
      args[:admin_email],
      args[:admin_password],
      args[:admin_first_name],
      args[:admin_last_name],
      args[:locale]
    )

    Helpers.invoke_task('bootstrap:verify', args[:shortname])

    puts 'Bootstrap all complete'
  end
end
