namespace :solr do

  desc "initializes the Solr connection"
  task :connect => :environment do

    solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[RAILS_ENV]

    SOLR = RSolr.connect :url => "http://#{solr_config['solr']['hostname']}:#{solr_config['solr']['port']}/solr"

  end

  desc "delete the index"
  task :delete => :connect do

    puts "\nDeleting index..."

    # clear the index
    SOLR.delete_by_query '*:*'

    puts "done"

  end

  desc "reindex the archive contents for Solr search"
  task :reindex => :delete do

    BATCH=25
    offset=0
    total = Interview.count :all

    puts "\nReindexing #{total} interviews..."

    while(offset<total)

      Interview.find(:all, :limit => "#{offset},#{BATCH}").each do |interview|
        interview.index
      end

      STDOUT.printf '.'
      STDOUT::flush

      offset += BATCH
    end

    Sunspot.commit

    puts "\nReindexing complete."

  end


end