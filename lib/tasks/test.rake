namespace :test do

  desc "moves existing imports forward in time to have some recent imports for testing"
  task :recent_imports => :environment do
    updated = 0
    count = 0
    puts "Touching some imports to move them forward in time."
    Import.find(:all, :conditions => "importable_type = 'interview'", :limit => '0,100', :order => "RAND()").each do |import|
      new_time = (Time.now - rand(24*7).hours).to_s(:db)
      updated += Import.update_all ['created_at = ?', new_time], "id = #{import.id}"
      count += 1
      if count % 10 == 0
        STDOUT.printf '.'
        STDOUT.flush
      end
    end
    puts "\nDone. Updated #{updated} interview imports to be recent."
  end

end