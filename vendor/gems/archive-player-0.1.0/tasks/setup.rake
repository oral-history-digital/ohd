#TODO: copy images
namespace :setup do

  RAILS_ROOT = File.join(File.dirname(__FILE__), '/../../../..')
  GEM_ROOT = File.join(File.dirname(__FILE__), '..')

  desc "Installs archiveplayer js, image & swf files to /public directory"
  task :install do
    require 'fileutils'

    swf_dir = File.join(RAILS_ROOT, 'public/swf')
    unless File.directory?(swf_dir)
      puts "Creating the swf directory"
      FileUtils.mkdir(swf_dir)
    end

    puts "\nCopying swf resources:"
    gem_swf_dir = File.join(GEM_ROOT, 'assets/swf')
    Dir.glob(File.join(gem_swf_dir, '*.swf')).each do |file|
      filename = file.split('/').last
      if File.exists?(File.join(swf_dir, filename))
        puts filename + " already exists, skipping."
      else
        FileUtils.cp(file, File.join(swf_dir, filename))
        puts "Copied #{filename}."
      end
    end

    js_dir = File.join(RAILS_ROOT, 'public/javascripts')
    puts "\nCopying javascript files:"
    Dir.glob(File.join(GEM_ROOT, 'assets/javascripts/*.js')).each do |file|
      filename = file.split('/').last
      if File.exists?(File.join(js_dir, filename))
        puts filename + " already exists, skipping."
      else
        FileUtils.cp(file, File.join(js_dir, filename))
        puts "Copied #{filename}."
      end
    end

    image_dir = File.join(RAILS_ROOT, 'public/images')
    puts "\nCopying image files:"
    Dir.glob(File.join(GEM_ROOT, 'assets/images/*.gif')).each do |file|
      filename = file.split('/').last
      if File.exists?(File.join(image_dir, filename))
        puts filename + " already exists, skipping."
      else
        FileUtils.cp(file, File.join(image_dir, filename))
        puts "Copied #{filename}."
      end
    end

    config_dir = File.join(RAILS_ROOT, 'config')
    if File.exists?(File.join(config_dir, 'player.yml'))
      puts "\nPlayer configuration file already exists. Skipping (config/player.yml)."
    else
      FileUtils.cp(File.join(GEM_ROOT,'config/player.yml'), File.join(config_dir, 'player.yml'))
      puts "\nCopied player configuration file to 'config/player.yml'."
    end

    puts "\nInstallation complete. Please see the README for further details."
  end

=begin
  NOTE: This is not needed. The application files belong to the
  application and could be modified etc. This is out of the scope
  of the gem.
  desc "Deletes archiveplayer js & swf from /public directory"
  task :uninstall do
    require 'fileutils'
    #TODO: remove archiveplayer files from /public
  end
=end

end