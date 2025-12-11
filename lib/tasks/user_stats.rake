# Usage examples:
#
#   Display comprehensive user statistics:
#     bin/rake user:stats
#
#   Show all unconfirmed users sorted by email:
#     bin/rake user:show[unconfirmed,email_asc]
#
#   Show blocked users sorted by creation date (oldest first):
#     bin/rake user:show[blocked,created_at_asc]
#
#   Show users who never logged in, sorted by last login, skip first 10:
#     bin/rake user:show[never_logged_in,last_login_asc,10]
#
#   Show all users without email addresses:
#     bin/rake user:show[no_email]
#
#   Available criteria for user:show:
#     - all, confirmed, unconfirmed, blocked, never_logged_in
#     - confirmed_never_logged_in, no_email, no_password, no_name
#
#   Available sort options for user:show:
#     - created_at_asc, created_at_desc (default)
#     - email_asc, email_desc
#     - last_login_asc, last_login_desc

namespace :user do
  desc "Print statistics about users in the database"
  task stats: :environment do
    # Disable SQL logging for cleaner output
    old_logger = ActiveRecord::Base.logger
    ActiveRecord::Base.logger = nil
    
    puts "\n" + "=" * 70
    puts "USER STATISTICS"
    puts "=" * 70
    
    # Basic counts
    total_users = User.count
    blocked_users = User.where(workflow_state: 'blocked').count
    removed_users = User.where(workflow_state: 'removed').count
    created_users = User.where(workflow_state: 'created').count
    afirmed_users = User.where(workflow_state: 'afirmed').count
    confirmed_never_logged_in = User.where(
      workflow_state: 'afirmed',
      current_sign_in_at: nil,
      last_sign_in_at: nil
    ).count
    never_logged_in_all = User.where(current_sign_in_at: nil, last_sign_in_at: nil).count
    
    puts "\n--- BASIC COUNTS ---"
    puts "Total users:                      #{total_users}"
    puts "Active accounts (afirmed):        #{afirmed_users}"
    puts "  - Confirmed, never logged in:   #{confirmed_never_logged_in}"
    puts "Newly created (unconfirmed):      #{created_users}"
    puts "Never logged in:                  #{never_logged_in_all}"
    puts "Blocked accounts:                 #{blocked_users}"
    puts "Removed accounts:                 #{removed_users}"
    
    # Password hash statistics
    bcrypt_users = User.where(
      "encrypted_password LIKE '$2a$%' OR 
       encrypted_password LIKE '$2b$%' OR 
       encrypted_password LIKE '$2y$%'"
    ).count
    
    empty_password_users = User.where(encrypted_password: ["", nil]).count
    non_bcrypt_users = total_users - bcrypt_users - empty_password_users
    
    puts "\n--- PASSWORD HASH STATISTICS ---"
    puts "Users with BCrypt hash:           #{bcrypt_users}"
    puts "Users without BCrypt hash:        #{non_bcrypt_users}"
    puts "Users with empty password hash:   #{empty_password_users}"
    
    # Missing data statistics
    empty_email_users = User.where(email: ["", nil]).count
    empty_first_name_users = User.where("first_name IS NULL OR first_name = ''").count
    empty_last_name_users = User.where("last_name IS NULL OR last_name = ''").count
    empty_name_users = User.where("(first_name IS NULL OR first_name = '') OR (last_name IS NULL OR last_name = '')").count
    users_without_email_and_password = User.where(
      email: ["", nil],
      encrypted_password: ["", nil]
    ).count
    
    puts "\n--- MISSING DATA STATISTICS ---"
    puts "Users with empty email:           #{empty_email_users}"
    puts "Users with empty first name:      #{empty_first_name_users}"
    puts "Users with empty last name:       #{empty_last_name_users}"
    puts "Users with empty name (either):   #{empty_name_users}"
    puts "Users without email & password:   #{users_without_email_and_password}"
    
    # Registration date statistics
    puts "\n--- REGISTRATION DATE STATISTICS ---"
    registration_buckets = {
      "Last 7 days" => 7.days.ago,
      "Last 30 days" => 30.days.ago,
      "Last 90 days" => 90.days.ago,
      "Last 6 months" => 6.months.ago,
      "Last 1 year" => 1.year.ago,
      "1-2 years" => 2.years.ago,
      "2-3 years" => 3.years.ago,
      "3-4 years" => 4.years.ago,
      "4-5 years" => 5.years.ago,
      "5-6 years" => 6.years.ago,
      "6-7 years" => 7.years.ago,
      "7-8 years" => 8.years.ago,
      "8-9 years" => 9.years.ago,
      "9-10 years" => 10.years.ago
    }
    
    no_registration_date = User.where(created_at: nil).count
    puts "No registration date:             #{no_registration_date}"
    
    previous_date = Time.current
    registration_buckets.each do |label, date|
      count = User.where(created_at: date..previous_date).count
      puts "#{label.ljust(30)} #{count}"
      previous_date = date
    end
    
    older_than_10_years = User.where("created_at < ?", 10.years.ago).count
    puts "#{"Older than 10 years".ljust(30)} #{older_than_10_years}"
    
    # Last login statistics with histogram
    puts "\n" + "=" * 70
    puts "HISTOGRAM OF USER LAST LOGINS (ALL USERS vs NON-BCRYPT USERS)"
    puts "=" * 70
    puts "#{"Bucket".ljust(30)} #{"ALL".rjust(8)}    #{"NON-BCRYPT".rjust(12)}"
    puts "-" * 70
    
    # Get non-bcrypt users for comparison
    non_bcrypt_user_ids = User.where(
      "encrypted_password NOT LIKE '$2a$%' AND 
       encrypted_password NOT LIKE '$2b$%' AND 
       encrypted_password NOT LIKE '$2y$%' AND
       (encrypted_password IS NOT NULL AND encrypted_password != '')"
    ).pluck(:id)
    
    # Never logged in (already calculated above)
    never_logged_in_non_bcrypt = User.where(
      id: non_bcrypt_user_ids,
      current_sign_in_at: nil,
      last_sign_in_at: nil
    ).count
    puts "#{"Never logged in".ljust(30)} #{never_logged_in_all.to_s.rjust(8)}    #{never_logged_in_non_bcrypt.to_s.rjust(12)}"
    
    # Time-based buckets
    login_buckets = [
      ["Last 7 days", 7.days.ago, Time.current],
      ["Last 30 days", 30.days.ago, 7.days.ago],
      ["Last 90 days", 90.days.ago, 30.days.ago],
      ["Last 6 months", 6.months.ago, 90.days.ago],
      ["Last 1 year", 1.year.ago, 6.months.ago],
      ["1-2 years", 2.years.ago, 1.year.ago],
      ["2-3 years", 3.years.ago, 2.years.ago],
      ["3-4 years", 4.years.ago, 3.years.ago],
      ["4-5 years", 5.years.ago, 4.years.ago],
      ["5-6 years", 6.years.ago, 5.years.ago],
      ["6-7 years", 7.years.ago, 6.years.ago],
      ["7-8 years", 8.years.ago, 7.years.ago],
      ["8-9 years", 9.years.ago, 8.years.ago],
      ["9-10 years", 10.years.ago, 9.years.ago]
    ]
    
    login_buckets.each do |label, start_date, end_date|
      all_count = User.where(
        "(current_sign_in_at BETWEEN ? AND ?) OR (last_sign_in_at BETWEEN ? AND ?)",
        start_date, end_date, start_date, end_date
      ).count
      
      non_bcrypt_count = User.where(
        id: non_bcrypt_user_ids
      ).where(
        "(current_sign_in_at BETWEEN ? AND ?) OR (last_sign_in_at BETWEEN ? AND ?)",
        start_date, end_date, start_date, end_date
      ).count
      
      puts "#{label.ljust(30)} #{all_count.to_s.rjust(8)}    #{non_bcrypt_count.to_s.rjust(12)}"
    end
    
    # Older than 10 years
    older_all = User.where(
      "(current_sign_in_at < ? OR last_sign_in_at < ?) AND 
       (current_sign_in_at IS NOT NULL OR last_sign_in_at IS NOT NULL)",
      10.years.ago, 10.years.ago
    ).count
    
    older_non_bcrypt = User.where(
      id: non_bcrypt_user_ids
    ).where(
      "(current_sign_in_at < ? OR last_sign_in_at < ?) AND 
       (current_sign_in_at IS NOT NULL OR last_sign_in_at IS NOT NULL)",
      10.years.ago, 10.years.ago
    ).count
    
    puts "#{"Older than 10 years".ljust(30)} #{older_all.to_s.rjust(8)}    #{older_non_bcrypt.to_s.rjust(12)}"
    
    puts "\n" + "=" * 70
    puts "END OF STATISTICS"
    puts "=" * 70 + "\n"
    
    # Restore logger
    ActiveRecord::Base.logger = old_logger
  end

  desc "Show users matching specific criteria"
  task :show, [:criteria, :limit, :sort, :skip] => :environment do |t, args|
    # Disable SQL logging for cleaner output
    old_logger = ActiveRecord::Base.logger
    old_level = ActiveRecord::Base.logger&.level
    ActiveRecord::Base.logger = Logger.new(nil)
    
    criteria = args[:criteria] || 'never_logged_in'
    limit = (args[:limit] || 50).to_i
    sort = args[:sort] || 'created_at_desc'
    skip = (args[:skip] || 0).to_i
    
    # Determine sort order
    order_by = case sort
    when 'created_at_asc'
      'created_at ASC'
    when 'created_at_desc'
      'created_at DESC'
    when 'email_asc'
      'email ASC'
    when 'email_desc'
      'email DESC'
    when 'last_login_asc'
      'COALESCE(last_sign_in_at, current_sign_in_at) ASC'
    when 'last_login_desc'
      'COALESCE(last_sign_in_at, current_sign_in_at) DESC'
    else
      'created_at DESC'
    end
    
    users = case criteria
    when 'never_logged_in'
      User.where(current_sign_in_at: nil, last_sign_in_at: nil).order(order_by).offset(skip).limit(limit)
    when 'unconfirmed'
      User.where(workflow_state: 'created').order(order_by).offset(skip).limit(limit)
    when 'confirmed_never_logged_in'
      User.where(workflow_state: 'afirmed', current_sign_in_at: nil, last_sign_in_at: nil).order(order_by).offset(skip).limit(limit)
    when 'blocked'
      User.where(workflow_state: 'blocked').order(order_by).offset(skip).limit(limit)
    when 'removed'
      User.where(workflow_state: 'removed').order(order_by).offset(skip).limit(limit)
    when 'no_bcrypt'
      User.where("encrypted_password NOT LIKE '$2a$%' AND 
                  encrypted_password NOT LIKE '$2b$%' AND 
                  encrypted_password NOT LIKE '$2y$%' AND
                  (encrypted_password IS NOT NULL AND encrypted_password != '')").order(order_by).offset(skip).limit(limit)
    when 'empty_password'
      User.where(encrypted_password: ["", nil]).order(order_by).offset(skip).limit(limit)
    when 'empty_email'
      User.where(email: ["", nil]).order(order_by).offset(skip).limit(limit)
    when 'empty_name'
      User.where("(first_name IS NULL OR first_name = '') OR (last_name IS NULL OR last_name = '')").order(order_by).offset(skip).limit(limit)
    else
      puts "Unknown criteria: #{criteria}"
      puts "\nAvailable criteria:"
      puts "  never_logged_in              - Users who never signed in"
      puts "  unconfirmed                  - Users in 'created' state (unconfirmed)"
      puts "  confirmed_never_logged_in    - Confirmed users who never signed in"
      puts "  blocked                      - Blocked users"
      puts "  removed                      - Removed users"
      puts "  no_bcrypt                    - Users without BCrypt password hash"
      puts "  empty_password               - Users with empty password"
      puts "  empty_email                  - Users with empty email"
      puts "  empty_name                   - Users with empty first or last name"
      puts "\nSort options:"
      puts "  created_at_desc (default)    - Newest first"
      puts "  created_at_asc               - Oldest first"
      puts "  email_asc                    - Email A-Z"
      puts "  email_desc                   - Email Z-A"
      puts "  last_login_asc               - Last login earliest first"
      puts "  last_login_desc              - Last login most recent first"
      puts "\nUsage: bin/rake user:show[criteria,limit,sort,skip]"
      puts "Example: bin/rake user:show[never_logged_in,100,created_at_asc,0]"
      puts "Example: bin/rake user:show[unconfirmed,50,email_asc,100]  # skip first 100"
      next
    end
    
    puts "\n" + "=" * 100
    puts "USERS MATCHING CRITERIA: #{criteria.upcase} (limit: #{limit}, sort: #{sort}, skip: #{skip})"
    puts "=" * 100
    puts "#{"ID".ljust(10)} #{"EMAIL".ljust(40)} #{"STATE".ljust(12)} #{"CREATED".ljust(12)} #{"LAST LOGIN".ljust(12)}"
    puts "-" * 100
    
    users.each do |user|
      last_login = user.last_sign_in_at&.strftime('%Y-%m-%d') || 
                   user.current_sign_in_at&.strftime('%Y-%m-%d') || 
                   'never'
      puts "#{user.id.to_s.ljust(10)} #{user.email.ljust(40)} #{user.workflow_state.ljust(12)} #{(user.created_at&.strftime('%Y-%m-%d') || 'N/A').ljust(12)} #{last_login.ljust(12)}"
    end
    
    puts "-" * 100
    puts "Total: #{users.count} users shown"
    puts "=" * 100 + "\n"
    
    # Restore logger
    ActiveRecord::Base.logger = old_logger
  end
end
