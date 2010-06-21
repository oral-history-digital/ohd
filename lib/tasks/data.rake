namespace :data do

#  desc 'Dumps the data into csv files'
#  task :dump => :environment do
#
#  end

  desc "Setup the initial data for test / demo deployments"
  task :setup => :environment do

    Rake::Task['import:interviews'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'interviews.csv')})

    Rake::Task['import:credits'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'credits.csv')})

    Rake::Task['import:tapes'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'tapes.csv')})

    Rake::Task['import:captions'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'captions.csv')})

    Rake::Task['data:segment_duration'].execute

  end


  desc "updates segment duration"
  task :segment_duration => :environment do

    puts "Updating segment duration..."

    batch=5
    offset=0
    total = Tape.count(:all)

    while(offset < total)

      Tape.find(:all, :include => :segments, :limit => "#{offset},#{batch}").each do |tape|

        next if tape.segments.empty?

        previous_segment = nil

        previous_time = 0

        maximum_duration = 0

        tape.segments.each do |segment|

          time = segment.start_time

          puts "#{segment.media_id} [#{segment.timecode}] earlier than #{previous_segment.media_id} [#{previous_segment.timecode}]" if previous_segment && previous_segment.start_time > time

          unless previous_segment.nil?

            duration = time - previous_time

            unless (duration < 0) || ((duration == segment.duration) && (!segment.duration.nil?))
              previous_segment.update_attribute :duration, duration
            else
              puts "Could not set duration for #{segment.media_id}!" unless duration == segment.duration
            end

            maximum_duration = duration if duration > maximum_duration

          end

          previous_segment = segment
          previous_time = time

        end

        maximum_duration = 1.5 * maximum_duration

        tape.segments.last.update_attribute :duration, maximum_duration

        STDOUT.printf '.'
        STDOUT.flush

      end

      offset += batch

    end

    puts "\ndone."

  end

  desc "Assign collection titles"
  task :collection_titles => :environment do

    cleanup = lambda do |string|
      string.downcase!
      string.gsub!('ä','ae')
      string.gsub!('ü','ue')
      string.gsub!('ö','oe')
      string.gsub!('ß','ss')
      string.gsub!('ó','o')
      string
    end

    Collection.find(:all).each do |collection|
      pid = collection.name.split(/[-–]/)
      prefix = pid.first.strip
      prefix.sub!('Zeugen ','')
      suffix = pid.last.strip
      suffix.sub!(/(Universität|Fernuni)/i,'')
      collection.project_id = (cleanup.call(prefix.strip) + ' ' + cleanup.call(suffix.strip)).gsub(/\s+/,'_')
      puts "#{collection.name} => #{collection.project_id}"
      collection.save!
    end

  end

end