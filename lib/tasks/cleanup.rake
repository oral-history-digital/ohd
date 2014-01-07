namespace :cleanup do

  desc "cleans up UserRegistration#created_at"
  task :user_creation_dates => :environment do
    puts "Cleaning up problematic creation dates for UserRegistration:"
    ids = UserRegistration.all(:conditions => ["created_at = ?", '0000-00-00 00:00:00']).map(&:id)
    updated = UserRegistration.update_all "created_at = '#{Time.gm(2010,1,1).to_s(:db)}'", "id IN (#{ids.join(',')})"
    puts "#{updated} registrations updated."
  end

  desc "harmonize user job_descriptions and research_interests"
  task :harmonize_users_data => :environment do
    require 'yaml'

    cleanup_value = lambda do |value|
      return 'Other' if value.blank?
      value = case value
                when String
                  value.gsub('"','').strip
                when Hash
                  value.keys.first.to_s.gsub('"','').strip
                else
                  (value.to_s.split(/[.,;=>]+/).first || '').gsub('"','').strip
              end
    end
    translate_field_value = lambda do |value, field|
      I18n.t(value, :scope => "devise.registration_values.#{field}", :locale => :de)
    end
    index, edited, users = 0,0,0

    # store translations that have been applied
    harmonized_jobs = {}
    harmonized_intentions = {}

    # some user_registrations appear to be invalid - store them here
    invalid_reg_ids = []
    invalid_user_ids = []

    puts "Starting harmonization of user/registration job_descriptions and research_intentions"
    UserRegistration.find_each do |reg|
      index += 1
      if index % 50 == 0
        STDOUT.printf '.'
        STDOUT.flush
      end
      begin
        reg_info = YAML::load(reg.application_info)
        job = cleanup_value.call(reg_info[:job_description])
        reg_info[:job_description] = translate_field_value.call(job, :job_description)
        intentions = cleanup_value.call(reg_info[:research_intentions])
        reg_info[:research_intentions] = translate_field_value.call(intentions, :research_intentions)
      rescue StandardError => e
        puts "ERROR: #{e.message}\n\nregistration: #{reg.inspect}\n\napplication_info: #{reg_info.inspect}"
        exit
      end
      reg.application_info = reg_info.to_yaml
      if reg.changed?
        harmonized_jobs[job] ||= reg_info[:job_description]
        harmonized_intentions[intentions] ||= reg_info[:research_intentions]
        begin
         reg.save!
         edited += 1
        rescue StandardError => e
          puts "ERROR: #{e.message}\n\nregistration: #{reg.inspect}\n\nreg.valid? => #{reg.valid?}"
          invalid_reg_ids << reg.id
        end
        unless reg.user.nil?
          reg.user.job_description = translate_field_value.call(reg.user.job_description, :job_description)
          reg.user.research_intentions = translate_field_value.call(reg.user.research_intentions, :research_intentions)
          begin
            reg.user.save!
            users += 1
          rescue StandardError => e
            puts "ERROR: #{e.message}\n\nuser#{reg.user.inspect}\n\nuser.valid? => #{reg.user.valid?}"
            invalid_user_ids << reg.user.id
          end
        end
      end
    end
    puts "Saving #{harmonized_jobs.keys.size} job assignments to 'harmonized_jobs.yaml'"
    File.open('harmonized_jobs.yaml','w+') do |f|
      harmonized_jobs.keys.each do |k|
        f.puts "'#{k}': '#{harmonized_jobs[k]}'"
      end
    end
    puts "Saving #{harmonized_intentions.keys.size} intentions assignments to 'harmonized_intentions.yaml'"
    File.open('harmonized_intentions.yaml','w+') do |f|
      harmonized_intentions.keys.each do |k|
        f.puts "'#{k}': '#{harmonized_intentions[k]}'"
      end
    end
    puts "Saving #{invalid_reg_ids.size} invalid registrations to 'invalid_registrations.yaml'"
    File.open('invalid_registrations.yaml','w+') do |f|
      invalid_reg_ids.each do |id|
        f.puts UserRegistration.find(id).to_yaml
      end
    end
    puts "Saving #{invalid_user_ids.size} invalid users to 'invalid_users.yaml'"
    File.open('invalid_users.yaml','w+') do |f|
      invalid_user_ids.each do |id|
        f.puts User.find(id).to_yaml
      end
    end

    puts "\nDone. #{edited} user_registrations of #{index} and #{users} users harmonized."
  end

  # WARNING: unused categories could still be in the index
  # MAKE SURE YOU HAVE AN UP-TO-DATE INDEX BEFORE RUNNING THIS
  desc "Removes unused categories - those that aren't used by any interviews"
  task :unused_categories => :environment do

    puts "Checking for unused categories:"

    cats = Category.all(:joins => "LEFT JOIN categorizations AS cz ON cz.category_id = categories.id", :conditions => "cz.id IS NULL")
    puts "#{cats.size} unused categories found#{cats.size > 0 ? ' - deleting.' : ''}"
    cats.each do |category|
      puts "#{category.category_type}: #{category.name} deleted."
      category.destroy
    end

    puts "Done."

  end

  desc "Removes duplicate categorizations - two or more assignments to exactly the same category for an interview"
  task :remove_duplicate_categories => :environment do

    puts "Checking duplicates for #{Category.count(:all)} categories:"

    Category.find_each do |category|

      duplicate_categorizations = Categorization.all(:conditions => "category_id = #{category.id}", :group => "interview_id", :having => "count(interview_id) > 1")

      duplicate_categorizations.each do |categorization|
        removed = Categorization.delete_all "interview_id = #{categorization.interview_id} AND category_id = #{categorization.category_id} AND id != #{categorization.id}"
        if removed > 0
          puts "\n - deleted #{removed} duplicate categorization(s) for interview #{categorization.interview_id} '#{category.name}' (#{category.category_type})"
        end
      end

      STDOUT.printf '.'
      STDOUT.flush

    end

    puts "Done."

  end

  desc "Removes empty location references"
  task :remove_empty_locations => :environment do

    empty_locs = LocationReference.all :conditions => "name REGEXP '^.{1,2}$'"

    puts "\nChecking #{empty_locs.size} location_references for empty descriptors."
    deleted = 0

    empty_locs.each do |loc|
      if loc.name.scan(/[a-z0-9]/).empty?
        loc.destroy
        deleted += 1
      end
      STDOUT.printf '.'
      STDOUT.flush
    end

    puts "\n#{deleted} location_references deleted."

  end

  desc "Fixes user_registrations that are by all means registered, but don't have that workflow state"
  task :registered_users => :environment do

    puts "Attempting to fix user_registrations that are missing the 'registered' workflow state:"

    conditions = "workflow_state = 'checked' AND activated_at IS NOT NULL"

    updated = 0
    mismatched = 0

    UserRegistration.find_each(:conditions => conditions) do |registration|
      next if registration.user_account.confirmed_at.nil? || registration.user_account.encrypted_password.nil?
      if registration.user_account.deactivated_at.nil?
        if (registration.activated_at - registration.user_account.confirmed_at) < 1.minute
          puts "Updating '#{registration.user_account.login}/#{registration.email}', confirmed at: #{registration.user_account.confirmed_at.strftime('%d.%m.%Y %H:%M')}"
          updated += UserRegistration.update_all "workflow_state = 'registered'", "id = #{registration.id}"
        else
          puts "Confirmation/Activation mismatch for '#{registration.user_account.login}/#{registration.email}': conf=#{registration.user_account.confirmed_at}, act=#{registration.activated_at}"
          mismatched += 1
        end
      else
        puts "Deactivated account skipped: #{registration.user_account.login}"
      end
    end

    puts "Done. Updated #{updated} registrations. #{mismatched} registrations showed mismatch."

  end

  desc "assigns segments directly via associations to annotations"
  task :assign_annotation_segments => :environment do

    puts "Assigning segments to all annotations via association"
    count = 0
    index = 0
    total = Annotation.count :all

    Annotation.find_each(:conditions => "segment_id IS NULL") do |annotation|
      annotation.assign_segment
      count += 1 if annotation.save
      if (index += 1) % 10 == 0
        STDOUT.printf '.'; STDOUT.flush
      end
    end

    puts "\ndone. Updated #{count} of #{total} total Annotations."
  end

  # since the use-case is the same for both of these actions, they are grouped into
  # one task that recovers lost segment_ids
  desc "assigns segments directly to annotations and user_contents that have an invalid segment_id"
  task :reassign_lost_segments => :environment do

    puts "Assigning segments to all annotations that currently are missing their segment"
    count = 0
    index = 0
    total = Annotation.count :all, :conditions => "segments.id IS NULL", :include => :segment

    Annotation.find_each(:conditions => "segments.id IS NULL", :include => :segment) do |annotation|
      annotation.assign_segment
      count += 1 if annotation.save
      if (index += 1) % 10 == 0
        STDOUT.printf '.'; STDOUT.flush
      end
    end
    puts "\ndone. Updated #{count} of #{total} total Annotations with missing segments."

    puts "Assigning segments to all user_annotations that currently are missing their reference"
    count = 0
    index = 0
    refjoin = "LEFT JOIN segments ON user_contents.reference_id = segments.id AND user_contents.reference_type = 'Segment'"
    total = UserAnnotation.count :all, :conditions => "segments.id IS NULL", :joins => refjoin

    UserAnnotation.find_each(:conditions => "segments.id IS NULL", :joins => refjoin, :readonly => false) do |user_annotation|
      user_annotation.reference = Segment.find_by_media_id(user_annotation.media_id)
      count += 1 if user_annotation.save
      if (index += 1) % 10 == 0
        STDOUT.printf '.'; STDOUT.flush
      end
    end
    puts "\ndone. Updated #{count} of #{total} total UserAnnotations with missing references."

  end

  desc "removes assigned interviews for user-generated annotations to prevent deletion on import"
  task :unassign_user_annotation_interview => :environment do

    puts "Removing assigned interviews on user-generated annotations"
    count = 0
    index = 0
    total = UserAnnotation.count(:all, :conditions => "annotations.id IS NOT NULL", :include => :annotation)

    UserAnnotation.find_each(:conditions => "annotations.id IS NOT NULL", :include => :annotation) do |user_annotation|
      user_annotation.annotation.update_attribute :interview_id, nil
      count += 1 if user_annotation.annotation.save
      if (index += 1) % 10 == 0
        STDOUT.printf '.'; STDOUT.flush
      end
    end

    puts "\ndone. Updated #{count} of #{total} total user-generated Annotations."

  end

end
