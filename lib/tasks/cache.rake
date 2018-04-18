namespace :cache do

  #BASE_URL = 'http://da02.cedis.fu-berlin.de:94'
  BASE_URL = 'http://localhost:3000'

  desc 'visit start page'
  task :start => :environment do
    p "*** Getting start page"
    uri = URI.parse("#{BASE_URL}/de/")
    response = Net::HTTP.get_response(uri) rescue "error"
    if response.is_a? String
      p response
    else
      p "*** Got it #{response.code}"
    end
  end

  desc 'visit all interviews to fill up cache'
  task :interviews => :environment do
    Interview.all.each do |interview|
      p "*** Getting #{interview.archive_id}"
      uri = URI.parse("#{BASE_URL}/de/interviews/#{interview.archive_id}")
      response = Net::HTTP.get_response(uri) rescue "error"
      if response.is_a? String
        p response
      else
        p "*** Got it #{response.code}"
      end
    end
  end

  desc 'visit many possible search pages to fill up cache'
  task :search => :environment do
    pages_count = Interview.count / 12
    (1..pages_count).each do |i|
      p "*** Getting search page #{i}"
      uri = URI.parse("#{BASE_URL}/de/searches/archive.json?page=#{i}")
      response = Net::HTTP.get_response(uri) rescue "error"
      if response.is_a? String
        p response
      else
        p "*** Got it #{response.code}"
      end
    end
  end

  desc 'cache all'
  task :all => ['cache:start', 'cache:interviews', 'cache:search'] do
    puts 'cache complete.'
  end

end
