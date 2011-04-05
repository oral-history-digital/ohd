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

  desc "print out a list of all interviews with imported captions"
  task :interviews_with_captions => :environment do

    joins =  "RIGHT JOIN tapes ON tapes.interview_id = interviews.id RIGHT JOIN segments ON segments.tape_id = tapes.id"
    cond = "segments.id IS NOT NULL"

    ids = Interview.find(:all, :select => 'archive_id', :joins => joins, :conditions => cond, :group => 'interviews.id').map(&:archive_id)

    puts "\nInterviews with captions:"

    ids.sort.each do |archive_id|

      puts archive_id

    end

    puts "\ndone."

  end


  desc "Report on archive contents"
  task :content_report => :environment do

    @interviews = Interview.find :all
    last_import = Import.find(:all).last
    puts "\nReport on Archive Contents from #{(last_import.nil? ? Time.gm(2010,9,23).strftime('%d.%m.%Y') : last_import.time)}"
    puts "========================================================="
    puts "Interview total:            #{@interviews.size.to_s.rjust(6)}"
    puts "Interviews with transcript:  #{@interviews.select{|i| i.segmented }.size.to_s.rjust(6)}"
    puts "Interviews with headings:   #{@interviews.select{|i| i.researched }.size.to_s.rjust(6)}"
    puts
    puts "Locations total:            #{LocationReference.count(:all).to_s.rjust(6)}"
    puts "Indexed Locations:          #{LocationReference.count(:all,:conditions => ["classified = ?", false]).to_s.rjust(6)}"
    puts "Classified Locations:       #{LocationReference.count(:all, :conditions => ["classified = ?", true]).to_s.rjust(6)}"
    puts 
    puts "Location Segments:          #{LocationSegment.count(:all).to_s.rjust(6)}"
    interviews = Interview.count(:all, :joins => "RIGHT JOIN location_segments AS ls ON ls.interview_id = interviews.id", :group => "interviews.id").size
    puts "Interviews with LocSeg:     #{interviews.to_s.rjust(6)}"
    puts
    puts "Captions total:             #{Segment.count(:all).to_s.rjust(6)}"
    puts
    puts "Photos total:               #{Photo.count(:all).to_s.rjust(6)}"
    interviews = Interview.count(:all, :joins => "RIGHT JOIN photos ON photos.interview_id = interviews.id", :group => "interviews.id").size
    puts "Interviews with photos:     #{interviews.to_s.rjust(6)}"
    puts
    puts "Transcript documents:       #{TextMaterial.count(:all, :conditions => "document_type = 'Transcript'").to_s.rjust(6)}"
    interviews = Interview.count(:all, :joins => "RIGHT JOIN text_materials AS tm ON tm.interview_id = interviews.id AND tm.document_type = 'Transcript'", :group => "interviews.id").size
    puts "Interviews with transcripts:#{interviews.to_s.rjust(6)}"
    puts
    puts "Translation documents:      #{TextMaterial.count(:all, :conditions => "document_type = 'Translation'").to_s.rjust(6)}"
    interviews = Interview.count(:all, :joins => "RIGHT JOIN text_materials AS tm ON tm.interview_id = interviews.id AND tm.document_type = 'Translation'", :group => "interviews.id").size
    puts "Interviews with translation:#{interviews.to_s.rjust(6)}"
    puts
    puts "Done."

  end

end