#
# some tasks to join databases while maintaining references.
#
# procedure is as follows:
#
# 1. make dumps of both databases
#
# 2. on target db: rake database:get_max_id
#    (
#      get the maximum id from the target db - the one the other should be merged into
#    )
#    result: max-id-value
#
# 3. on source db: rake database:prepare_join[max-id,db-username,db-name]
#    (
#      add max(max-id-value from target-db, max-id-value from source-db), to all id- and *_id-fields of the source-db
#      dump source db without create table statements
#    )
#    result: prepared-source-db-name.sql
#
# 4. on target-db: run rake database:cleanup_active_storage
#
# 5. on target-db: mysql -u user -p target-db-name < prepared-source-db-name.sql
#
# 6. on target-db: run rake database:unify_[users|languages|permissions|institutions|norm_data_providers][max-id]
#
# 7. on target-db: run rake database:cleanup[max-id]
#
# 8. reindex target-db: rake solr:reindex:all

namespace :database do
  # Load the database configuration for the given environment, resolving any ERB and aliases
  def resolved_db_config(env_name)
    db_yml = File.expand_path('config/database.yml', Dir.pwd)
    require 'yaml'
    require 'erb'
    YAML.safe_load(ERB.new(File.read(db_yml)).result, aliases: true).fetch(env_name, {})
  end

  def import_dump_into_database(dump_path:, env_name:, remove_credentials: false, force: false)
    require 'open3'

    raise "Dump not found at #{dump_path}" unless File.exist?(dump_path)

    if remove_credentials
      # Remove credentials.yml.enc so Rails uses secrets.yml (no master.key in devcontainer).
      creds = File.expand_path('config/credentials.yml.enc', Dir.pwd)
      File.delete(creds) if File.exist?(creds)
    end

    db_config = resolved_db_config(env_name)
    host = db_config['host'] || 'db'
    user = db_config['username'] || 'root'
    password = db_config['password'] || 'rootpassword'
    database = db_config['database']

    raise "No database configured for environment '#{env_name}'" if database.to_s.strip.empty?

    count_sql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='#{database.to_s.gsub("'", "\\\\'")}';"
    stdout, status = Open3.capture2(
      { 'MYSQL_PWD' => password.to_s },
      'mysql', '-N', '-B', '-h', host.to_s, '-u', user.to_s, '-e', count_sql
    )
    raise "Failed to inspect target database '#{database}'" unless status.success?

    table_count = stdout.to_s.strip.to_i
    unless force || table_count.zero?
      if !$stdin.tty?
        raise "Database '#{database}' already contains #{table_count} tables. Re-run with FORCE=true to continue non-interactively."
      end

      print "Database '#{database}' already contains #{table_count} tables. Drop and import from #{dump_path}? [y/N]: "
      answer = $stdin.gets.to_s.strip.downcase
      raise 'Import cancelled by user' unless %w[y yes].include?(answer)
    end

    puts "Dropping and recreating #{database}…"
    drop_and_create_sql = "DROP DATABASE IF EXISTS #{database}; CREATE DATABASE #{database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    ok = system({ 'MYSQL_PWD' => password.to_s }, 'mysql', '-h', host.to_s, '-u', user.to_s, '-e', drop_and_create_sql)
    raise "Failed to drop and recreate #{database}" unless ok

    puts "Importing #{dump_path}…"
    source_cmd = dump_path.end_with?('.gz') ? ['gunzip', '-c', dump_path] : ['cat', dump_path]
    statuses = Open3.pipeline(
      source_cmd,
      [{ 'MYSQL_PWD' => password.to_s }, 'mysql', '-h', host.to_s, '-u', user.to_s, database.to_s]
    )
    raise 'Failed to import database dump' unless statuses.all?(&:success?)

    puts 'Running migrations…'
    ok = system({ 'RAILS_ENV' => env_name, 'RAILS_LOG_LEVEL' => 'error' }, 'bundle', 'exec', 'rails', 'db:migrate')
    raise "Failed to run migrations for #{env_name}. Run manually: bundle exec rails db:migrate RAILS_ENV=#{env_name}" unless ok

    puts "\n✓ #{database} imported and migrated."
  end

  desc 'show development database'
  task :show => :environment do
    database = Rails.configuration.database_configuration['development']['database']
    puts "Development database: #{database}"
  end

  desc 'get max id from current db'
  task :get_max_id => :environment do
    max = 0
    Rails.application.eager_load!
    ([ActiveStorage::Attachment, ActiveStorage::Blob] | ActiveRecord::Base.descendants).uniq.each do |model|
      if ActiveRecord::Base.connection.table_exists?(model.table_name) && model.column_names.include?('id')
        puts model
        max = [model.maximum(:id) || 0, max].max
      end
    end
    puts "max id is: #{max}"
  end

  desc 'add x to all id and *_id fields'
  task :add_to_all_id_fields, [:max_id] => :environment do |t, args|
    Rails.application.eager_load!
    ([ActiveStorage::Attachment, ActiveStorage::Blob] | ActiveRecord::Base.descendants).uniq{|a| a.table_name}.each do |model|
      if ActiveRecord::Base.connection.table_exists?(model.table_name)
        puts "updating #{model}"
        id_columns = ['id'] | (model.column_names.select{|a| a =~ /_id$/} - ['archive_id', 'media_id', 'public_id', 'url_without_id', 'citation_media_id'])
        update_statement = id_columns.map{|c| "#{c} = #{c} + #{args[:max_id]}"}.join(', ')
        sql = "UPDATE #{model.table_name} SET #{update_statement}"
        puts sql
        ActiveRecord::Base.connection.execute("SET FOREIGN_KEY_CHECKS=0")
        ActiveRecord::Base.connection.execute(sql)
        ActiveRecord::Base.connection.execute("SET FOREIGN_KEY_CHECKS=1")
      end
      puts "---"
    rescue StandardError => e
      puts "#{e.message}: #{e.backtrace}"
      puts "not updated #{model}"
    end
  end

  desc 'prepare for join (add x and dump)'
  task :prepare_join, [:max_id, :user, :db] => :environment do |t, args|
    Rake::Task['database:add_to_all_id_fields'].invoke(args.max_id)
    cmd = "mysqldump -u #{args.user} -p #{args.db} -t --insert-ignore --complete-insert --ignore-table=#{args.db}.ar_internal_metadata --ignore-table=#{args.db}.schema_migrations > prepared-#{args.db}.sql"
      puts cmd
      exec cmd
  end

  desc 'cleanup active storage'
  task :cleanup_active_storage => :environment do
    ActiveStorage::Attachment.all.each do |attachment|
      unless attachment.record
        blob = attachment.blob
        attachment.destroy
        blob && blob.destroy
      end
    end
  end

  desc 'unify users'
  task :unify_users, [:max_id] => :environment do |t, args|
    raise 'Please provide max_id-parameter' unless args.max_id
    User.group(:email).count.select{|k,v| v > 1}.each do |email, count|
      first_user = User.where(email: email).where("id <= ?", args.max_id).first
      if first_user
        other_users = User.where(email: email).where("id > ?", args.max_id)

        other_users.each do |user|
          user.user_projects.update_all(user_id: first_user.id)

          user.user_roles.update_all(user_id: first_user.id)
          user.tasks.update_all(user_id: first_user.id)
          user.user_contents.update_all(user_id: first_user.id)
          user.searches.update_all(user_id: first_user.id)

          if !first_user.confirmed_at && user.confirmed_at
            first_user.update(confirmed_at: user.confirmed_at)
          end
          user.destroy
        end
      end
    end
  end

  desc 'unify languages'
  task :unify_languages, [:max_id] => :environment do |t, args|
    raise 'Please provide max_id-parameter' unless args.max_id
    Language.all.each do |language|
      first_language = Language.where(name: language.name).where("languages.id <= ?", args.max_id).first
      if first_language
        other_languages = Language.where(name: language.name).where("languages.id > ?", args.max_id)
        other_languages.each do |other_language|
          other_language.interview_languages.update_all(language_id: first_language.id)
          other_language.destroy
        end
      end
    end
  end

  desc 'unify permissions'
  task :unify_permissions, [:max_id] => :environment do |t, args|
    raise 'Please provide max_id-parameter' unless args.max_id
    Permission.group(:klass, :action_name).count.select{|k,v| v > 1}.each do |(klass, action_name), count|
      first_perm = Permission.where(klass: klass, action_name: action_name).where("id <= ?", args.max_id).first
      if first_perm
        other_perms = Permission.where(klass: klass, action_name: action_name).where("id > ?", args.max_id)

        other_perms.each do |perm|
          perm.role_permissions.update_all(permission_id: first_perm.id)
          perm.task_type_permissions.update_all(permission_id: first_perm.id)
          perm.destroy
        end
      end
    end
  end

  desc 'unify institutions'
  task :unify_institutions, [:max_id] => :environment do |t, args|
    raise 'Please provide max_id-parameter' unless args.max_id
    Institution.all.each do |institution|
      first_institution = Institution.where(name: institution.name).where("institutions.id <= ?", args.max_id).first
      if first_institution
        other_institutions = Institution.where(name: institution.name).where("institutions.id > ?", args.max_id)
        first_institution && other_institutions.each do |other_institution|
          other_institution.collections.update_all(institution_id: first_institution.id)
          other_institution.institution_projects.update_all(institution_id: first_institution.id)
          other_institution.destroy
        end
      end
    end
  end

  desc 'unify norm_data_providers'
  task :unify_norm_data_providers, [:max_id] => :environment do |t, args|
    raise 'Please provide max_id-parameter' unless args.max_id
    NormDataProvider.all.each do |norm_data_provider|
      first_norm_data_provider = NormDataProvider.where(name: norm_data_provider.name).where("norm_data_providers.id <= ?", args.max_id).first
      if first_norm_data_provider
        other_norm_data_providers = NormDataProvider.where(name: norm_data_provider.name).where("norm_data_providers.id > ?", args.max_id)
        other_norm_data_providers.each do |other_norm_data_provider|
          other_norm_data_provider.norm_data.update_all(norm_data_provider_id: first_norm_data_provider.id)
          other_norm_data_provider.destroy
        end
      end
    end
  end

  desc 'cleanup'
  task :cleanup, [:max_id] => :environment do |t, args|
    raise 'Please provide max_id-parameter' unless args.max_id
    TranslationValue.where("id > ?", args.max_id).destroy_all
    UserProject.where("id > ?", args.max_id).where(processed_at: nil).each do |user_project|
      user_project.update(processed_at: user_project.user && user_project.user.created_at)
    end
  end

  desc 'Import SQL dump into configured database and migrate (supports .sql and .sql.gz)'
  task :import, [:dump_path] do |t, args|
    env_name = ENV.fetch('TARGET_ENV', ENV.fetch('RAILS_ENV', 'development'))
    force = ENV.fetch('FORCE', 'false').to_s.downcase == 'true'
    dump_path = args[:dump_path] || ENV['DUMP_PATH']
    raise 'Provide dump path as task arg or DUMP_PATH env var' if dump_path.to_s.strip.empty?

    if env_name == 'production' && ENV.fetch('ALLOW_DATABASE_IMPORT_PRODUCTION', 'false').to_s.downcase != 'true'
      raise 'Refusing to import into production by default. Set ALLOW_DATABASE_IMPORT_PRODUCTION=true to override.'
    end

    import_dump_into_database(
      dump_path: File.expand_path(dump_path, Dir.pwd),
      env_name: env_name,
      remove_credentials: false,
      force: force
    )
  end

  desc 'Drop and reimport the devcontainer database dump (.devcontainer/db/dump.sql.gz), then migrate'
  task :reimport do
    env = ENV.fetch('RAILS_ENV', 'development')
    raise 'database:reimport can only be run in development (RAILS_ENV=development)' unless env == 'development'

    import_dump_into_database(
      dump_path: File.expand_path('.devcontainer/db/dump.sql.gz', Dir.pwd),
      env_name: 'development',
      remove_credentials: true,
      force: true
    )
  end
end
