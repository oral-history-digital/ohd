# lib/tasks/cache_cleanup.rake
# Manual rake task to remove entire directories older than X days from tmp/cache/application.
namespace :cache do
  desc "Clear old directories from tmp/cache/application older than X days. Use DAYS=7 (default) or DIR=/path/to/dir"
  task :clear_old => :environment do
    require "fileutils"

    dir = ENV.fetch("DIR", Rails.root.join("tmp", "cache", "application").to_s)
    days = ENV.fetch("DAYS", "7").to_i
    max_age = days.days
    now = Time.current

    unless File.directory?(dir)
      puts "Directory not found: #{dir}"
      next
    end

    deleted = 0
    errors = 0

    # Collect directories (exclude the root). Sort by depth so children removed first.
    begin
      dirs = Dir.glob(File.join(dir, "**/")).map { |d| Pathname.new(d) }
      dirs = dirs.select { |p| p.directory? && p != Pathname.new(dir) }
      dirs.sort_by! { |p| -p.each_filename.to_a.size }
    rescue => e
      puts "Error enumerating directories in #{dir}: #{e.class} #{e.message}"
      next
    end

    dirs.each do |d|
      begin
        next unless d.exist?
        if (now - d.mtime) > max_age
          FileUtils.rm_rf(d.to_s)
          deleted += 1
        end
      rescue => e
        errors += 1
        puts "Error deleting #{d}: #{e.class} #{e.message}"
      end
    end

    puts "Deleted #{deleted} directories from #{dir} (errors: #{errors})"
  end
end
