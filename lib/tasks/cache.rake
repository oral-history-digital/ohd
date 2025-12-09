require "open-uri"

namespace :cache do

  # crontab: 0 2 * * * /bin/rails cache:clear_old DIR=/path/to/dir DAYS=7 RAILS_ENV=production
  desc "Clear old directories from tmp/cache/application older than X days. Use DAYS=28 (default) or DIR=/path/to/dir"
  task :clear_old => :environment do
    require "fileutils"

    dir = ENV.fetch("DIR", Rails.root.join("tmp", "cache", "application").to_s)
    days = ENV.fetch("DAYS", "28").to_i
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

  def base_url(project)
    if Rails.env.development?
      'http://localhost:3000'
    else
      project.archive_domain
    end
  end

  # rake cache:clear[cdoh]
  #desc 'clear project cache'
  #task :clear, [:cache_key_prefix] => :environment do |t, args|
    #project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    #if project
      ##Rails.cache.redis.keys("#{project.cache_key_prefix}-*").each{|k| Rails.cache.delete(k)}
      #`rm -rf #{Rails.root}/tmp/cache/application/*`
    #else
      #puts "no project with cache_key_prefix #{args.cache_key_prefix} found"
    #end
  #end

  desc 'visit start page'
  task :start, [:cache_key_prefix] => :environment do |t, args|
    p "*** Getting start page"
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    uri = URI.parse("#{base_url(project)}/#{project.default_locale}/")
    get uri
  end

  desc 'visit all interviews to fill up cache'
  task :interviews, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each do |interview|
      p "*** Getting #{interview.archive_id}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/interviews/#{interview.archive_id}.json")
      get uri
    end
  end

  desc 'visit all interviews-data-routes to fill up cache'
  task :interview_data, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each do |interview|
      [
        :segments,
        :headings,
        :speaker_designations,
        #:references,
        :ref_tree
      ].each do |data_type|
        p "*** Getting #{data_type} for #{interview.archive_id}"
        uri = URI.parse("#{base_url(project)}/#{project.default_locale}/interviews/#{interview.archive_id}/#{data_type}.json")
        get uri
      end
    end
  end

  desc 'visit registry references for interview'
  task :registry_references , [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each do |interview|
      p "*** Getting registry references for #{interview.archive_id}"
      person_refs = URI.parse("#{base_url(project)}/#{project.default_locale}/registry_entries?ref_object_type=Person&ref_object_id=#{interview.interviewee.id}")
      get person_refs
      interview_refs = URI.parse("#{base_url(project)}/#{project.default_locale}/registry_entries?ref_object_type=Interview&ref_object_id=#{interview.id}")
      get interview_refs
    end
  end

  desc 'visit contributors for interview'
  task :contributors, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each do |interview|
      p "*** Getting contributors #{interview.archive_id}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/people?contributors_for_interview=#{interview.id}")
      get uri
    end
  end

  desc 'visit all other necessary data to fill up cache'
  task :other_data, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    [
      :people
    ].each do |data_type|
      p "*** Getting #{data_type}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/#{data_type}.json")
      get uri
    end
  end

  desc 'visit all interviews-download-routes to fill up cache'
  task :interview_downloads, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each do |interview|
      [
        'history',
        'interview',
      ].each do |kind|
        project.available_locales.each do |locale|
          p "*** Getting download #{kind} in #{locale} for #{interview.archive_id}"
          uri = URI.parse("#{base_url(project)}/#{project.default_locale}/interviews/#{interview.archive_id}.pdf?lang=#{locale}&kind=#{kind}")
          get uri
        end
      end
    end
  end

  desc 'visit all interviews locations to fill up cache'
  task :locations, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each do |interview|
      p "*** Getting locations for #{interview.archive_id}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/locations.json?archive_id=#{interview.archive_id}")
      get uri
    end
  end

  desc 'visit many possible search pages to fill up cache'
  task :search, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    pages_count = Interview.count / 12
    (1..pages_count).each do |i|
      p "*** Getting search page #{i}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/searches/archive.json?page=#{i}")
      get uri
    end
  end

  desc 'search for all the names to fill up cache'
  task :name_searches, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each  do |i|
      p "*** Getting search for #{i.title(:de)}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/searches/archive.json?fulltext=#{ERB::Util.url_encode(i.title(:de))}&page=1")
      get uri
    end
  end

  desc 'visit all registry_entries to fill up cache'
  task :registry_entries, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    RegistryEntry.all.each do |registry_entry|
      p "*** Getting registry_entry #{registry_entry.id}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/registry_entries/#{registry_entry.id}.json")
      get uri
      assoc_uri = URI.parse("#{base_url(project)}/#{project.default_locale}/registry_entries/#{registry_entry.id}?with_associations=true")
      get assoc_uri
    end
  end

  desc 'visit all people to fill up cache'
  task :people, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Person.all.each do |person|
      p "*** Getting person #{person.id}"
      people = URI.parse("#{base_url}/#{project.default_locale}/people/#{person.id}.json")
      get people
      if person.interviews.first
        people_with_assoc = URI.parse("#{base_url(project)}/#{project.default_locale}/people/#{person.id}?with_associations=true")
        get people_with_assoc
      end
    end
  end

 desc 'visit all inteview pages - this task is not part of cache_all'
  task :interview_uris, [:cache_key_prefix] => :environment do |t, args|
    project = Project.where(cache_key_prefix: args.cache_key_prefix).first
    Interview.all.each  do |i|
    #Interview.where(archive_id: 'mog85').first  do |i|
      p "*** Getting interview of #{i.title(:de)} - #{i.archive_id}"
      uri = URI.parse("#{base_url(project)}/#{project.default_locale}/interviews/#{i.archive_id}")
      get uri
      sleep(60)
    end
  end

  desc 'cache all'
  task :all, [:cache_key_prefix] => [
    'cache:start',
    'cache:search',
    'cache:name_searches',
    'cache:interviews',
    'cache:interview_data',
    'cache:registry_references',
    'cache:contributors',
    'cache:other_data',
    # TODO: fix this
    #'cache:interview_downloads',
    'cache:locations',
    'cache:registry_entries',
    'cache:people'
  ] do
    puts 'cache complete.'
  end

  def get(uri)
    open(uri, http_basic_authentication: ["chrgregor@googlemail.com", "bla4bla"]) do |f|
      p "*** Got it #{f.status[0]} (#{f.status[1]})"
    end
  rescue StandardError => e
    p "*** Error: #{e}"
    p "*** backtrace: #{e.backtrace}"
  end

end
