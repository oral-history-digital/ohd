#
# some tasks to join databases while maintaining references.
#
# procedure is as follows:
# 1. on target db: rake database:get_max_id
#    (
#      get the maximum id from the target db - the one the other should be merged into
#    )
#    result: max-id-value
#
# 2. on source db: rake database:prepare_join[max-id,db-username,db-name]
#    (
#      add max(max-id-value from target-db, max-id-value from source-db), to all id- and *_id-fields of the source-db
#      dump source db without create table statements
#    )
#    result: prepared-source-db-name.sql
#
# 3. on target-db: mysql -u user -p target-db-name < prepared-source-db-name.sql
#
# 4. on target-db: run rake database:unify_[user_accounts|languages|permissions|institutions]

namespace :database do

    desc 'get max id from current db'
    task :get_max_id => :environment do
      max = 0
      Rails.application.eager_load!
      ActiveRecord::Base.descendants.each do |model|
        if ActiveRecord::Base.connection.table_exists? model.table_name
          puts model
          max = [model.maximum(:id) || 0, max].max
        end
      end
      puts "max id is: #{max}"
    end

    desc 'add x to all id and *_id fields' 
    task :add_to_all_id_fields, [:max_id] => :environment do |t, args|
      Rails.application.eager_load!
      ([ActiveStorage::Attachment, ActiveStorage::Blob] | ActiveRecord::Base.descendants).each do |model|
        puts "updating #{model}"
        id_columns = ['id'] | (model.attribute_names.select{|a| a =~ /_id$/} - ['archive_id', 'media_id', 'public_id'])
        id_columns.each do |col|
          if ActiveRecord::Base.connection.table_exists? model.table_name
            puts "updating #{col}"
            sql = "UPDATE #{model.table_name} SET #{col} = #{col} + #{args.max_id.to_i}"
            puts sql
            ActiveRecord::Base.connection.execute(sql)
          end
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

    desc 'unify user_accounts'
    task :unify_user_accounts, [:max_id] => :environment do |t, args|
      UserRegistration.group(:email).count.select{|k,v| v > 1}.each do |email, count|
        first_ur = UserRegistration.where(email: email).where("id <= ?", args.max_id).first
        if first_ur
          other_urs = UserRegistration.where(email: email).where("id > ?", args.max_id)

          other_urs.each do |ur|
            ur.user_registration_projects.update_all(user_registration_id: first_ur.id)

            ur.user_account.user_roles.update_all(user_account_id: first_ur.user_account_id)
            ur.user_account.tasks.update_all(user_account_id: first_ur.user_account_id)
            ur.user_account.user_contents.update_all(user_account_id: first_ur.user_account_id)
            ur.user_account.searches.update_all(user_account_id: first_ur.user_account_id)

            ur.user_account.destroy
            ur.destroy
          end
        end
      end
    end

    desc 'unify languages'
    task :unify_languages, [:max_id] => :environment do |t, args|
      Language.all.each do |language|
        first_language = Language.where(name: language.name).where("languages.id <= ?", args.max_id).first
        other_languages = Language.where(name: language.name).where("languages.id > ?", args.max_id)
        other_languages.each do |other_language|
          other_language.interviews.update_all(language_id: first_language.id)
          other_language.destroy
        end
      end
    end

    desc 'unify permissions'
    task :unify_permissions, [:max_id] => :environment do |t, args|
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
      Institution.all.each do |institution|
        first_institution = Institution.where(name: institution.name).where("institutions.id <= ?", args.max_id).first
        other_institutions = Institution.where(name: institution.name).where("institutions.id > ?", args.max_id)
        other_institutions.each do |other_institution|
          other_institution.collections.update_all(institution_id: first_institution.id)
          other_institution.institution_projects.update_all(institution_id: first_institution.id)
          other_institution.destroy
        end
      end
    end

end
