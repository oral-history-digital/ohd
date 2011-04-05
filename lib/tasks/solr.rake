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
    solr_connection
  end



  namespace :delete do

    desc "fully delete the index"
    task :all => 'solr:connect' do

      puts "\nDeleting index..."

      # clear the index
      solr_connection.delete_by_query '*:*'
      solr_connection.commit

      puts "done"

    end

    desc "delete the index for interviews"
    task :interviews => 'solr:connect' do

      puts "\nDeleting index for interviews..."

      # clear the index
      solr_connection.delete_by_query 'type:Interview'
      solr_connection.commit

      puts "done."

    end


    desc "delete the index for segments"
    task :segments => 'solr:connect' do

      puts "\nDeleting index for segments..."

      # clear the index
      solr_connection.delete_by_query 'type:Segment'
      solr_connection.commit

      puts "done."

    end


    desc "delete the index for locations"
    task :locations => 'solr:connect' do

      puts "\nDeleting the index for locations"
      solr_connection.delete_by_query 'type:LocationReference'
      solr_connection.commit

      puts "done."

    end


    desc "deletes interviews with given ids (archive_ids)"
    task :by_archive_id, [ :ids, :type ] => 'solr:connect' do |task, args|

      ids = args[:ids] || nil
      type = args[:type] || '*'
      raise "no ids given! Use the ids= argument to provide a list of archive_ids" if ids.nil?
      ids = ids.split(/\W+/)

      puts "\nDeleting the index for #{ids.size} interviews..."

      ids.each do |archive_id|
        query = 'archive_id_ss:' + archive_id
        query += '&type:' + type if type != '*'
        solr_connection.delete_by_query query
        puts archive_id + ' (' + type + ')'
      end
      solr_connection.commit

    end

  end



  namespace :index do

    desc "builds the index from a clean slate"
    task :build => ['solr:index:interviews', 'solr:index:segments']

    desc "builds the index for interviews"
    task :interviews, [ :ids ] => :environment do |task, args|

      ids = args[:ids] || nil
      ids = ids.split(/\W+/) unless ids.nil?

      # Interviews
      batch=25
      offset=0
      conditions = ids.nil? ? [] : "interviews.archive_id IN ('#{ids.join("','")}')"
      total = Interview.count :all, :conditions => conditions

      puts "\nIndexing #{total} interviews..."

      while(offset<total)

        Interview.find(:all, :conditions => conditions,
                       :limit => "#{offset},#{batch}").each do |interview|
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
    task :segments, [ :interviews ] => :environment do |task, args|

      ids = args[:interviews] || nil
      ids = ids.split(/\W+/) unless ids.nil?

      # Segments
      batch=25
      offset=0
      joins = "RIGHT JOIN tapes ON tapes.id = segments.tape_id"
      conds = "segments.id IS NOT NULL"
      if ids.nil?
        joins << " AND tapes.interview_id IS NOT NULL"
      else
        joins << " RIGHT JOIN interviews ON interviews.id = tapes.interview_id"
        conds << " AND interviews.archive_id IN ('#{ids.split(',').join("','")}')"
      end
      total = Segment.count :all, :joins => joins, :conditions => conds

      puts "\nIndexing #{total} segments..."

      while(offset<total)

        Segment.find(:all, :joins => joins, :conditions => conds, :limit => "#{offset},#{batch}").each do |segment|
          begin
            segment.index
          rescue Exception => e
            puts "#{e.class.name} on #{segment.inspect}\n#{e.message}"
            exit
          end
        end

        if offset/batch % 400 == 0
          STDOUT.printf "[#{offset}]"
        else
          STDOUT.printf '.'
        end
        STDOUT::flush

        offset += batch
      end

      Sunspot.commit

      puts

    end

    desc "Builds the location register index"
    task :locations => :environment do

      puts "\nIndexing #{LocationReference.count(:all)} locations:"

      LocationReference.find_each(:batch_size => 50) do |location|
        next if location.interview.blank?
        next unless location.classified
        location.index
        STDOUT.printf '.'
        STDOUT::flush
      end

      Sunspot.commit

      puts "\ndone."

    end

  end



  namespace :reindex do

    desc "reindex the archive contents for Solr search"
    task :all => ['solr:delete:all', 'solr:index:interviews', 'solr:index:segments', 'solr:index:locations'] do
      puts "Reindexing complete."
    end


    desc "reindex interviews"
    task :interviews => ['solr:delete:interviews', 'solr:index:interviews'] do
      puts "Reindexing interviews complete."
    end

    desc "reindex interviews by archive_id"
    task :by_archive_id, [ :ids ] => 'solr:connect' do |task, args|
      ids = args[:ids] || nil
      raise "no ids given! Use the ids= argument to provide a list of archive_ids" if ids.nil?

      Rake::Task['solr:delete:by_archive_id'].execute({ :ids => ids })
      Rake::Task['solr:index:interviews'].execute({ :ids => ids })
      Rake::Task['solr:index:segments'].execute({ :interviews => ids })
    end

    desc "reindex interview data only"
    task :interview_data, [:ids] => 'solr:connect' do |task, args|
      ids = args[:ids] || nil
      raise "no ids given! Use the ids= argument to provide a list of archive_ids" if ids.nil?
      Rake::Task['solr:delete:by_archive_id'].execute({ :ids => ids, :type => 'Interview' })
      Rake::Task['solr:index:interviews'].execute({ :ids => ids })
    end

    desc "reindex segments"
    task :segments => ['solr:delete:segments', 'solr:index:segments'] do
      puts "Reindexing segments complete."
    end

    desc "reindex locations"
    task :locations => ['solr:delete:locations', 'solr:index:locations'] do
      puts "Reindexing locations complete."
    end

  end

  def solr_connection
    unless defined?($SOLR)
      solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[RAILS_ENV]

      url = "http://#{solr_config['solr']['hostname']}:#{solr_config['solr']['port']}/#{solr_config['solr']['path'].strip.gsub(/^\//, '')}"
      puts "Connecting to: '#{url}'"

      $SOLR = RSolr.connect :url => url
    else
      $SOLR
    end
  end

end