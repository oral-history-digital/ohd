namespace :cache do

  BASE_URL = 'https://archive.occupation-memories.org'
  #BASE_URL = 'http://localhost:3000'

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
        :doi_content,
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

  desc 'cache all'
  task :all => ['cache:start', 'cache:interviews', 'cache:interview_data', 'cache:locations', 'cache:search'] do
    puts 'cache complete.'
  end

  def get(uri)
    response = Net::HTTP.get_response(uri)
    p "*** Got it #{response.code}"
  rescue StandardError => e
    p "*** Error: #{e}"
    p "*** backtrace: #{e.backtrace}"
  end

end
