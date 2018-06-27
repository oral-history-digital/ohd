namespace :data do

  desc 'print out a list of all interviews with imported captions'
  task :interviews_with_captions => :environment do

    joins = 'RIGHT JOIN tapes ON tapes.interview_id = interviews.id RIGHT JOIN segments ON segments.tape_id = tapes.id'
    cond = 'segments.id IS NOT NULL'

    ids = Interview.all(:select => 'archive_id', :joins => joins, :conditions => cond, :group => 'interviews.id').map(&:archive_id)

    puts "\nInterviews with captions:"

    ids.sort.each do |archive_id|

      puts archive_id

    end

    puts "\ndone."

  end


  desc "updates segment duration"
  task :segment_duration, [:id] => :environment do |task,args|

    total = 0
    id = args[:id]
    unless id.nil?
      interview = Interview.where(archive_id: id).first
      if interview.nil?
        puts "\nNo such interview (archive_id): '#{id}'. Exiting."
        exit
      end
      total = Tape.count(interview_id: interview.id)
    end

    batch=5
    offset=0

    puts "Updating segment duration... (#{total} tapes total)"

    while offset < total

      Tape.all(:conditions => conditions, :include => :segments, :limit => "#{offset},#{batch}").each do |tape|

        next if tape.segments.empty?

        previous_segment = nil

        previous_time = 0

        maximum_duration = BigDecimal.new("0")

        tape.segments.each do |segment|

          time = Timecode.new(segment.timecode).time

          unless previous_segment.nil?

            duration = time - previous_time
            duration = 999.99 if duration > 999.99

            unless (duration < 0) || ((duration == previous_segment.duration))
              Segment.update_all "duration = '#{duration.round(2)}'", "id = #{previous_segment.id}"
            end

            maximum_duration = duration if duration > maximum_duration

          end

          previous_segment = segment
          previous_time = time

        end

        Segment.update_all "duration = '#{maximum_duration.round(2)}'", "id = #{tape.segments.last.id}"

        STDOUT.printf '.'
        STDOUT.flush

      end

      offset += batch

    end

    puts "\ndone."

  end

  desc 'Report on archive contents'
  task :content_report => :environment do

    @interviews = Interview.all
    last_import = Import.all.last
    puts "\nReport on Archive Contents from #{(last_import.nil? ? Time.gm(2010,9,23).strftime('%d.%m.%Y') : last_import.time)}"
    puts '========================================================='
    puts "Interview total:            #{@interviews.size.to_s.rjust(6)}"
    puts "Interviews with transcript:  #{@interviews.select{|i| i.segmented }.size.to_s.rjust(6)}"
    puts "Interviews with headings:   #{@interviews.select{|i| i.researched }.size.to_s.rjust(6)}"
    puts
    puts "Locations total:            #{LocationReference.count.to_s.rjust(6)}"
    puts "Indexed Locations:          #{LocationReference.count(:conditions => ['classified = ?', false]).to_s.rjust(6)}"
    puts "Classified Locations:       #{LocationReference.count(:conditions => ['classified = ?', true]).to_s.rjust(6)}"
    puts
    puts "Location Segments:          #{LocationSegment.count.to_s.rjust(6)}"
    interviews = Interview.count(:joins => 'RIGHT JOIN location_segments AS ls ON ls.interview_id = interviews.id', :group => 'interviews.id').size
    puts "Interviews with LocSeg:     #{interviews.to_s.rjust(6)}"
    puts
    puts "Captions total:             #{Segment.count.to_s.rjust(6)}"
    puts
    puts "Photos total:               #{Photo.count.to_s.rjust(6)}"
    interviews = Interview.count(:joins => 'RIGHT JOIN photos ON photos.interview_id = interviews.id', :group => 'interviews.id').size
    puts "Interviews with photos:     #{interviews.to_s.rjust(6)}"
    puts
    puts "Transcript documents:       #{TextMaterial.count(:conditions => "document_type = 'Transcript'").to_s.rjust(6)}"
    interviews = Interview.count(:joins => "RIGHT JOIN text_materials AS tm ON tm.interview_id = interviews.id AND tm.document_type = 'Transcript'", :group => 'interviews.id').size
    puts "Interviews with transcripts:#{interviews.to_s.rjust(6)}"
    puts
    puts "Translation documents:      #{TextMaterial.count(:conditions => "document_type = 'Translation'").to_s.rjust(6)}"
    interviews = Interview.count(:joins => "RIGHT JOIN text_materials AS tm ON tm.interview_id = interviews.id AND tm.document_type = 'Translation'", :group => 'interviews.id').size
    puts "Interviews with translation:#{interviews.to_s.rjust(6)}"
    puts
    puts 'Done.'

  end

end
