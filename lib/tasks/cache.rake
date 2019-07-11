require "open-uri"

namespace :cache do

  if Rails.env.development?
    BASE_URL = 'http://localhost:3000'
  else
    project = Archive::Application.config.project["project_id"]
    case project.to_sym
      when :zwar
        BASE_URL = 'https://archiv.zwangsarbeit-archiv.de'
      when :hagen
        BASE_URL = 'http://da03.cedis.fu-berlin.de:81'
      when :mog
        BASE_URL = 'https://archive.occupation-memories.org'
    end
  end

  desc 'visit start page'
  task :start => :environment do
    p "*** Getting start page"
    uri = URI.parse("#{BASE_URL}/de/")
    get uri
  end

  desc 'visit all interviews to fill up cache'
  task :interviews => :environment do
    Interview.all.each do |interview|
      p "*** Getting #{interview.archive_id}"
      uri = URI.parse("#{BASE_URL}/de/interviews/#{interview.archive_id}.json")
      get uri
    end
  end

  desc 'visit all interviews-data-routes to fill up cache'
  task :interview_data => :environment do
    Interview.all.each do |interview|
      [
        :doi_contents,
        :segments,
        :headings,
        #:references,
        :ref_tree
      ].each do |data_type|
        p "*** Getting #{data_type} for #{interview.archive_id}"
        uri = URI.parse("#{BASE_URL}/de/interviews/#{interview.archive_id}/#{data_type}.json")
        get uri
      end
    end
  end

  desc 'visit all other necessary data to fill up cache'
  task :other_data => :environment do
    [
      :people
    ].each do |data_type|
      p "*** Getting #{data_type}"
      uri = URI.parse("#{BASE_URL}/de/#{data_type}.json")
      get uri
    end
  end

  desc 'visit all interviews-download-routes to fill up cache'
  task :interview_downloads => :environment do
    Interview.all.each do |interview|
      [
        'history',
        'interview',
      ].each do |kind|
        Project.available_locales.each do |locale|
          p "*** Getting download #{kind} in #{locale} for #{interview.archive_id}"
          uri = URI.parse("#{BASE_URL}/de/interviews/#{interview.archive_id}.pdf?lang=#{locale}&kind=#{kind}")
          get uri
        end
      end
    end
  end

  desc 'visit all interviews locations to fill up cache'
  task :locations => :environment do
    Interview.all.each do |interview|
      p "*** Getting locations for #{interview.archive_id}"
      uri = URI.parse("#{BASE_URL}/de/locations.json?archive_id=#{interview.archive_id}")
      get uri
    end
  end

  desc 'visit many possible search pages to fill up cache'
  task :search => :environment do
    pages_count = Interview.count / 12
    (1..pages_count).each do |i|
      p "*** Getting search page #{i}"
      uri = URI.parse("#{BASE_URL}/de/searches/archive.json?page=#{i}")
      get uri
    end
  end

  desc 'search for all the names to fill up cache'
  task :name_searches => :environment do
    Interview.all.each  do |i|
      p "*** Getting search for #{i.title[:de]}"
      uri = URI.parse("#{BASE_URL}/de/searches/archive.json?fulltext=#{ERB::Util.url_encode(i.title[:de])}&page=1")
      get uri
    end
  end

  desc 'visit all registry_entries to fill up cache'
  task :registry_entries => :environment do
    RegistryEntry.all.each do |registry_entry|
      p "*** Getting registry_entry #{registry_entry.id}"
      uri = URI.parse("#{BASE_URL}/de/registry_entries/#{registry_entry.id}.json")
      get uri
    end
  end

  desc 'cache all'
  task :all => [
    'cache:start',
    'cache:search',
    'cache:name_searches',
    'cache:interviews',
    'cache:interview_data',
    'cache:other_data',
    'cache:interview_downloads',
    'cache:locations',
    'cache:registry_entries'
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
