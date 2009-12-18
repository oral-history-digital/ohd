namespace :data do

#  desc 'Dumps the data into csv files'
#  task :dump => :environment do
#
#  end

  desc "Setup the initial data for test / demo deployments"
  task :setup => :environment do

    Rake::Task['import:metadata'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'interviews.csv')})

    Rake::Task['import:credits'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'credits.csv')})

    Rake::Task['import:tapes'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'tapes.csv')})

    Rake::Task['import:segments'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'captions.csv')})

    Rake::Task['data:segment_duration'].execute

    Rake::Task['import:all_headings'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'headings.csv')})

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

          time = Timecode.new(segment.timecode).time

          unless previous_segment.nil?

            duration = time - previous_time

            unless (duration < 0) || ((duration == segment.duration) && (!segment.duration.nil?))
              previous_segment.update_attribute :duration, duration
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

  end

end