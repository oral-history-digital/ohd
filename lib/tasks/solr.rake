namespace :solr do

  desc "starting the Solr server - for testing: this has more verbose output that sunspot:solr:start"
  task :start do

    require 'net/http'
    
    solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[RAILS_ENV]

    solr_port = solr_config['solr']['port']
    gem_path = File.join(File.dirname(__FILE__), '..', '..', 'vendor', 'gems' )
    solr_path = File.join(Dir.glob(File.join(gem_path, 'sunspot-*')).first, 'solr')

    log_dir = File.join(File.dirname(__FILE__), '..', '..', 'log')

    begin
      n = Net::HTTP.new('127.0.0.1', solr_port)
      n.request_head('/').value

    rescue Net::HTTPServerException #responding
      puts "Port #{solr_port} in use" and return

    rescue Errno::ECONNREFUSED #not responding
      Dir.chdir(solr_path) do
        if RUBY_PLATFORM.include?('mswin32')
          exec "start #{'"'}solr_#{ENV['RAILS_ENV']}_#{solr_port}#{'"'} /min java -Dsolr.data.dir=#{File.join(log_dir, '..', 'solr', 'data')} -Djetty.logs=#{log_dir} -Djetty.port=#{solr_port} -jar start.jar"
        else
          pid = fork do
            #STDERR.close
            exec "java -Dsolr.data.dir=#{File.join(log_dir, '..', 'solr', 'data')} -Djetty.logs=#{log_dir} -Djetty.port=#{solr_port} -jar start.jar"
          end
        end
        sleep(5)
        File.open("#{log_dir}/#{ENV['RAILS_ENV']}_pid", "w"){ |f| f << pid}
        puts "#{ENV['RAILS_ENV']} Solr started successfully on #{solr_port}, pid: #{pid}."
      end
    end

  end

  desc "initializes the Solr connection"
  task :connect => :environment do

    solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[RAILS_ENV]

    url = "http://#{solr_config['solr']['hostname']}:#{solr_config['solr']['port']}/#{solr_config['solr']['path'].strip.gsub(/^\//, '')}"
    puts "Connecting to: '#{url}'"

    SOLR = RSolr.connect :url => url

  end



  namespace :delete do

    desc "fully delete the index"
    task :all => 'solr:connect' do

      puts "\nDeleting index..."

      # clear the index
      SOLR.delete_by_query '*:*'

      puts "done"

    end

    desc "delete the index for interviews"
    task :interviews => 'solr:connect' do

      puts "\nDeleting index for interviews..."

      # clear the index
      SOLR.delete_by_query 'type:Interview'

      puts "done"

    end


    desc "delete the index for segments"
    task :segments => 'solr:connect' do

      puts "\nDeleting index for segments..."

      # clear the index
      SOLR.delete_by_query 'type:Segment'

      puts "done"

    end

  end



  namespace :index do

    desc "builds the index from a clean slate"
    task :build => ['solr:index:interviews', 'solr:index:segments']

    desc "builds the index for interviews"
    task :interviews => :environment do

      # Interviews
      batch=25
      offset=0
      total = Interview.count :all

      puts "\nIndexing #{total} interviews..."

      while(offset<total)

        Interview.find(:all, :limit => "#{offset},#{batch}").each do |interview|
          interview.index
        end

        STDOUT.printf '.'
        STDOUT::flush

        offset += batch
      end

      Sunspot.commit

      puts

    end

    desc "builds the index for segments"
    task :segments => :environment do

      # Segments
      batch=25
      offset=0
      total = Segment.count :all

      puts "\nIndexing #{total} segments..."

      while(offset<total)

        Segment.find(:all, :limit => "#{offset},#{batch}").each do |segment|
          segment.index
        end

        STDOUT.printf '.'
        STDOUT::flush

        offset += batch
      end

      Sunspot.commit

      puts

    end

  end



  namespace :reindex do

    desc "reindex the archive contents for Solr search"
    task :all => ['solr:delete:all', 'solr:index:interviews', 'solr:index:segments'] do
      puts "Reindexing complete."
    end


    desc "reindex interviews"
    task :interviews => ['solr:delete:interviews', 'solr:index:interviews'] do
      puts "Reindexing interviews complete."
    end


    desc "reindex segments"
    task :segments => ['solr:delete:segments', 'solr:index:segments'] do
      puts "Reindexing segments complete."
    end

  end

end