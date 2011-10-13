namespace :user_content do

  desc "Sets link_urls for all user_contents that don't have them"
  task :set_link_urls => :environment do

    puts "Setting link_url for linkless user_contents:"

    index = 0
    UserContent.find_each(:conditions => "link_url IS NULL") do |content|
      content.send(:set_link_url)
      content.save!
      if (index += 1) % 30 == 1
        STDOUT.printf '.'
        STDOUT.flush
      end
    end

    puts "done. #{index} user_contents updated."

  end

end