# Load mail configuration if not in test environment
#if RAILS_ENV == 'production'
#  email_settings = YAML::load(File.open("#{RAILS_ROOT}/config/email.yml"))
#  ActionMailer::Base.smtp_settings = email_settings[RAILS_ENV].symbolize_keys unless email_settings[RAILS_ENV].nil?
#end

# Note, this was changed in favor of the more basic hash settings in environments/production.rb