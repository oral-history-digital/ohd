# lib/tasks/cache_warmer.rake

task :cache_warmer => :environment do
  ["mog010", "mog015", "mog012", "mog003", "mog002", "mog004", "mog005", "mog006", "mog038", "mog040", "mog051", "mog017", "mog018"].each do |archive_id|
    p "*** Getting #{archive_id}"
    uri = URI.parse("http://da02.cedis.fu-berlin.de:94/de/interviews/#{archive_id}")
    response = Net::HTTP.get_response(uri)
    p "*** Got it #{response.code}"
  end
end
