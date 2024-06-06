server "deploy_da03", roles: %w{app db web}

set :application, "mog_archive_staging"
#set :branch, 'extend_norm_data'

# 1 st problem
#set :branch, 'unteraufgabe/intarch-799-gender-divers-in-registrierung-einfuegen'
#to cope with duplicate gender column: insert into schema_migrations (version) values (20200604172907);

# 2nd problem
#set :branch, 'add_user_columns_to_user_account'
# migration 20200623090124 does not work for mog - no devise remember fields there.
# => comment out

# 3rd problem
# set :branch, :development
# migration 20200623190513 fails because of adding duplicate timestamps. but the other fields have been added before.
# => comment out

# 4th problem (maybe starting here will make problem 1-3 obsolete)
# still problems because of missing user model, so start with the commit when it disappeared.
#set :branch, :add_user_columns_to_user_account
# unsolved problem: varchar(255) content from user_registration is copied to varchar(191) in user_account
# - seems like all new fields are shorter because we use utf8_mb4 instead of utf8
# Fix manually:
# User.find_by_id(335).update_attributes(homepage: 'https://www.eap.gr')

#5th problem
# set :branch, :development
# setting index on RegistryEntry.code fails due to invalid data
# RegistryEntry.where(code: 0).update_all(code: nil)

# setting RegistryReferenceType.code index also fails - but why???
# FIXME: commented out index in migration 20200628131445_add_index_on_registry_codes.rb

# 20200708181534_cleanup_registrations_and_accounts_add_missing_activation.rb
# Attribute does not exist: UserRegistration.activated_at (zwar_archive has it)
# => add_column(:user_registrations, :activated_at, :datetime)

# 20200712114042_add_column_updated_at_to_user_registrations.rb
# => duplicate column updated_at, comment out

# == 20200804091822 CreateTasksForExistingInterviews: migrating =================
# undefined method `cleared!' for #<Task:0x000055c670b21498>
# TODO: deploy matching revision?


set :stage, :production
set :deploy_to, "/data/applications/#{fetch :application}"
set :bundle_path, "/data/bundle/01"
set :project_yml, "mog_staging.yml"
set :branch, ENV.fetch('BRANCH', 'release/mog')

set :rbenv_type, :system
set :rbenv_ruby, '2.7.7'
set :rbenv_custom_path, '/opt/rbenv'
