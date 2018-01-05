namespace :cache do

  desc 'visit all interviews to fill up cache'
  task :fill => :environment do
    Interview.all.each do |interview|
      p "*** Getting #{interview.archive_id}"
      uri = URI.parse("http://da02.cedis.fu-berlin.de:94/de/interviews/#{interview.archive_id}")
      response = Net::HTTP.get_response(uri)
      p "*** Got it #{response.code}"
    end
  end
end
