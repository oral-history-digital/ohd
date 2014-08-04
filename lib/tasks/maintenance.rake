namespace :maintenance do

  desc "Set site to 'off' state and generate maintenance file"
  task :off => :environment do

    File.open(File.join(Rails.root, 'tmp', 'maintenance.html'), 'w+') do |f|
      html = ERB.new File.new(File.join(Rails.root, 'app/views/layouts/maintenance.html.erb')).read.gsub('-%>','%>'), nil, '>'
      f.write html.result(binding)
    end

    if File.exists?(File.join(Rails.root, 'tmp', 'maintenance.html'))
      puts 'Site set to maintenance (OFFLINE). done.'
    else
      puts 'WARNING: Could not set site to maintenance!'
    end

  end

  desc "Set site to 'on' state and generate maintenance file"
  task :on => :environment do

    require 'fileutils'
    FileUtils.rm(File.join(Rails.root, 'tmp', 'maintenance.html'))

    if File.exists?(File.join(Rails.root, 'tmp', 'maintenance.html'))
      puts 'WARNING: Could not remove maintenance state!'
    else
      puts 'Site maintenance finished (ONLINE).'
    end

  end

end
