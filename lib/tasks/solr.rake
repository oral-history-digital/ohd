namespace :solr do

  desc 'starting the Solr server - for testing: this has more verbose output that sunspot:solr:start'
  task :start => :environment do

    require 'net/http'

    solr_home = File.join(File.dirname(__FILE__), '..', '..', 'solr')

    solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[Rails.env]
    solr_port = solr_config['solr']['port']
    solr_hostname = solr_config['solr']['hostname']
    solr_log_level = solr_config['solr']['log_level']

    begin
      n = Net::HTTP.new('127.0.0.1', solr_port)
      n.request_head('/').value

    rescue Net::HTTPServerException #responding
      puts "Port #{solr_port} in use" and return

    rescue Errno::ECONNREFUSED #not responding
      puts "#{ENV['Rails.env']} Solr starting on #{solr_hostname}:#{solr_port}."
      exec "sunspot-solr run -s #{solr_home} -b #{solr_hostname} -p #{solr_port} -l #{solr_log_level}"
    end

  end

  desc 'initializes the Solr connection'
  task :connect => :environment do
    solr_connection
  end

  namespace :delete do

    desc 'fully delete the index'
    task :all => 'solr:connect' do

      puts "\nDeleting index..."

      # clear the index
      solr_connection.delete_by_query '*:*'
      solr_connection.commit

      puts 'done'

    end

    desc 'delete the index for interviews'
    task :interviews => 'solr:connect' do

      puts "\nDeleting index for interviews..."

      # clear the index
      solr_connection.delete_by_query 'type:Interview'
      solr_connection.commit

      puts 'done.'

    end


    desc 'delete the index for segments'
    task :segments => 'solr:connect' do

      puts "\nDeleting index for segments..."

      # clear the index
      solr_connection.delete_by_query 'type:Segment'
      solr_connection.commit

      puts 'done.'

    end


    desc 'delete the index for locations'
    task :locations => 'solr:connect' do

      puts "\nDeleting the index for locations"
      solr_connection.delete_by_query 'type:LocationReference'
      solr_connection.commit

      puts 'done.'

    end


    desc 'deletes interviews with given ids (archive_ids)'
    task :by_archive_id, [ :ids, :type ] => 'solr:connect' do |task, args|

      ids = args[:ids].blank? ? '*' : args[:ids]
      type = args[:type] || '*'
      ids = ids[Regexp.new("#{CeDiS.config.project_initials.downcase}\\d{3}")].nil? ? [ids] : ids.split(/\W+/)

      puts "\nDeleting the index for #{ids.first == '*' ? 'all' : ids.size} interviews..."

      ids.each do |archive_id|
        query = if archive_id == '*'
                  'type:' + type
                else
                  q = 'archive_id_ss:' + archive_id
                  q += 'AND type:' + type if type != '*'
                  q
                end
        solr_connection.delete_by_query query
        puts archive_id + ' (' + type + ')'
      end
      solr_connection.commit

    end

  end



  namespace :index do

    desc 'builds the index from a clean slate'
    task :build => ['solr:index:interviews', 'solr:index:segments']

    desc 'builds the index for interviews'
    task :interviews, [ :ids ] => :environment do |task, args|

      ids = args[:ids] || nil
      ids = ids.scan(Regexp.new("#{CeDiS.config.project_initials}\\d{3}", Regexp::IGNORECASE)) unless ids.nil?

      # Interviews
      conditions = ids.nil? ? [] : "interviews.archive_id IN ('#{ids.join("','")}')"
      total = Interview.count :conditions => conditions

      puts "\nIndexing #{total} interviews..."

      Interview.find_each(:conditions => conditions) do |interview|
        begin
          interview.index
        rescue => e
          puts "#{e.class.name} on #{interview.inspect}\n#{e.message}"
        end

        STDOUT.printf '.'
        STDOUT::flush
      end

      Sunspot.commit

      puts

    end

    desc 'builds the index for segments'
    task :segments, [ :interviews ] => :environment do |task, args|

      ids = args[:interviews] || nil
      ids = ids.split(/\W+/) unless ids.nil?

      # Segments
      joins = 'RIGHT JOIN tapes ON tapes.id = segments.tape_id'
      conds = 'segments.id IS NOT NULL'
      if ids.nil?
        joins << ' AND tapes.interview_id IS NOT NULL'
      else
        joins << ' RIGHT JOIN interviews ON interviews.id = tapes.interview_id'
        conds << " AND interviews.archive_id IN ('#{ids.split(',').join("','")}')"
      end

      total = Segment.count :joins => joins, :conditions => conds
      puts "\nIndexing #{total} segments..."

      Segment.find_each(:joins => joins, :conditions => conds) do |segment|
        begin
          segment.index
        rescue => e
          puts "#{e.class.name} on #{segment.inspect}\n#{e.message}"
        end

        STDOUT.printf '.'
        STDOUT::flush
      end

      Sunspot.commit

      puts

    end

    desc 'Builds the location register index'
    task :locations, [:interviews ] => :environment do |task,args|

      archive_id = (args[:interviews] || '').scan(Regexp.new("#{CeDiS.config.project_initials}\\d{3}", Regexp::IGNORECASE))
      interviews = Interview.all(
          :conditions => if archive_id.empty?
                           nil
                         else
                           archive_id.empty? ? nil : "archive_id IN ('#{archive_id.join("','")}')"
                         end
      )

      conditions = 'duplicate IS NOT TRUE'
      conditions += archive_id.empty? ? '' : " AND interview_id IN ('#{interviews.map(&:id).join("','")}')"

      puts "\nIndexing #{LocationReference.count(:conditions => conditions)} locations:"
      unless archive_id.empty?
        archive_id.each do |id|
          puts id
        end
      end

      LocationReference.find_each(:conditions => conditions, :batch_size => 50) do |location|
        next if location.interview.blank?
        next unless location.classified
        begin
          location.index
        rescue => e
          puts "#{e.class.name} on #{location.inspect}\n#{e.message}"
        end
        STDOUT.printf '.'
        STDOUT::flush
      end

      Sunspot.commit

      puts "\ndone."

    end

  end



  namespace :reindex do

    desc 'reindex the archive contents for Solr search'
    task :all => ['solr:delete:all', 'solr:index:interviews', 'solr:index:segments', 'solr:index:locations'] do
      puts 'Reindexing complete.'
    end

    desc 'one by one reindexing of all interviews'
    task :one_by_one => [ 'solr:connect', :environment ] do
      puts 'Gradually reindexing all interviews:'
      Interview.find_each do |interview|
        STDOUT.printf "\n\n=======\n#{interview.archive_id}"
        STDOUT.flush
        Rake::Task['solr:reindex:by_archive_id'].execute({:ids => interview.archive_id})
        puts "#{interview.archive_id} done.\n-----------"
        sleep 5
      end
    end

    desc 'reindexes interviews that have been imported less than hours= ago.'
    task :new, [:hours] => ['solr:connect', :environment] do |task,args|
      interval = args[:hours] || ENV['hours'] || 20
      puts "Indexing interviews that have been imported #{interval} hours or less ago:"
      count = 0
      Interview.find_each do |interview|
        if (interview.imports.last.created_at + interval.to_i.hours) >= Time.now
          puts "Indexing #{interview.archive_id}, imported at #{interview.imports.last.created_at}."
          Rake::Task['solr:reindex:by_archive_id'].execute({:ids => interview.archive_id})
          count += 1
        end
      end
      puts "\nDone. Indexed #{count} interviews."
    end

    desc 'randomly reindex a number of interviews'
    task :randomly,[:number] => ['solr:connect', :environment] do |task,args|
      number = args[:number] || ENV['number'] || Interview.count
      ids = Interview.all(:select => :id, :order => 'RAND()')[0..(number.to_i-1)].map(&:id)
      puts "Randomly indexing #{ids.size} interviews..."
      index = ids.size
      id = ids.shift
      while id
        interview = Interview.find(id.to_i)
        unless interview.nil?
          STDOUT.printf "\n\n======= [#{index}]\n#{interview.archive_id}"
          STDOUT.flush
          Rake::Task['solr:reindex:by_archive_id'].execute({:ids => interview.archive_id})
          puts "#{interview.archive_id} done.\n-----------"
          sleep 5
        end
        id = ids.shift
        index -= 1
      end
    end

    desc 'reindex interviews'
    task :interviews => ['solr:delete:interviews', 'solr:index:interviews'] do
      puts 'Reindexing interviews complete.'
    end

    desc 'reindex interviews by archive_id'
    task :by_archive_id, [ :ids ] => 'solr:connect' do |task, args|
      ids = args[:ids] || nil
      raise 'no ids given! Use the ids= argument to provide a list of archive_ids' if ids.nil?

      Rake::Task['solr:delete:by_archive_id'].execute({ :ids => ids })
      Rake::Task['solr:index:interviews'].execute({ :ids => ids })
      Rake::Task['solr:index:segments'].execute({ :interviews => ids })
      Rake::Task['solr:index:locations'].execute({ :interviews => ids })
    end

    desc 'reindex interview data only'
    task :interview_data, [:ids] => 'solr:connect' do |task, args|
      ids = args[:ids] || nil
      if ids.nil?
        Rake::Task['solr:delete:by_archive_id'].execute({ :type => 'Interview' })
        Rake::Task['solr:index:interviews'].execute
      else
        Rake::Task['solr:delete:by_archive_id'].execute({ :ids => ids, :type => 'Interview' })
        Rake::Task['solr:index:interviews'].execute({ :ids => ids })
      end
    end

    desc 'reindex segments'
    task :segments => ['solr:delete:segments', 'solr:index:segments'] do
      puts 'Reindexing segments complete.'
    end

    desc 'reindex locations'
    task :locations => ['solr:delete:locations', 'solr:index:locations'] do
      puts 'Reindexing locations complete.'
    end

  end

  def solr_connection
    if defined?($SOLR)
      $SOLR
    else
      solr_config = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', 'config', 'sunspot.yml'))[Rails.env]

      url = "http://#{solr_config['solr']['hostname']}:#{solr_config['solr']['port']}/#{solr_config['solr']['path'].strip.gsub(/^\//, '')}"
      puts "Connecting to: '#{url}'"

      $SOLR = RSolr.connect :url => url
    end
  end

end
