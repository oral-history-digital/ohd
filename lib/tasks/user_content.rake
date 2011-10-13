namespace :user_content do

  desc "Sets link_urls for all user_contents that don't have them"
  task :set_link_urls => :environment do

    puts "Setting link_url for linkless user_contents:"

    index = 0
    UserContent.find_each(:conditions => "link_url IS NULL") do |content|
      content.send(:set_link_url)
      content.save
      if (index += 1) % 30 == 1
        STDOUT.printf '.'
        STDOUT.flush
      end
    end

    puts "done. #{index} user_contents updated."

  end

  desc "Removes invalid user_contents"
  task :delete_invalid => :environment do

    puts "Checking for and deleting invalid user_contents:"

    index = 0
    deleted = 0
    UserContent.find_each do |content|
      unless content.valid?
        content.destroy
        deleted += 1
      end
      index += 1
      if (index += 1) % 30 == 1
        STDOUT.printf '.'
        STDOUT.flush
      end
    end

    puts "done. Deleted #{deleted} of #{index} user contents in total."

  end

end