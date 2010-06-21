namespace :cleanup do

  desc "make photo filenames consistent with existing resources"
  task :photos => :environment do

    offset = 0
    batch = 25
    total = Photo.count :all

    puts "Checking and cleaning photo resource paths for #{total} photos:"

    while offset < total

      Photo.find(:all, :limit => "#{offset},#{batch}").each do |photo|

        if !File.exists?(photo.photo.path)

          file = Dir.glob(photo.photo.path.sub(/\w{3}$/,'{jpg,JPG,png,PNG}')).first

          if file.nil?
            puts "No matching files found for photo #{photo.id}: #{photo.photo.path.split('/').last}"
            next
          end

          previous_filename = photo.photo_file_name
          new_filename = previous_filename.sub(/\w{3}$/, file.split('/').last[/\w{3}$/])

          # save this as photo file name
          photo.update_attribute :photo_file_name, new_filename

          puts "Changed photo #{photo.id} filename from '#{previous_filename}' to '#{new_filename}'"

        end

      end

      offset += batch

    end

    puts "done."

  end


  desc "cleanup segment ordering and tape assignment"
  task :segments => :environment do

    # 1. Upcase Media-IDS
    # Make sure the media id's are in the correct format first
    puts "\nUpcasing media_ids:"
    # upcase media_ids
    upcased = 0
    Segment.find(:all, :conditions => "media_id REGEXP 'za'").each do |segment|
      segment.update_attribute :media_id, segment.media_id.upcase
      upcased += 1
    end
    puts "Upcased #{upcased} segment media_ids. done.\n"


    # 2. Match with correct tapes
    # Make sure the segments match the tape according to media_id
    joins = "LEFT JOIN tapes ON tapes.id = segments.tape_id"
    conditions = "NOT( segments.media_id REGEXP tapes.media_id)"
    total = Segment.count(:all, :joins => joins, :conditions => conditions)
    puts "\nAttaching to the correct tape media_id: #{total} segments"
    tape = nil
    tape_ids_updated = 0

    Segment.find(:all, :joins => joins, :conditions => conditions, :readonly => false).each do |segment|
      tape_media_id = segment.media_id[/^za\d{3}_\d{2}_\d{2}/i].upcase
      unless tape.is_a?(Tape) && tape.media_id == tape_media_id
        tape = Tape.find_by_media_id tape_media_id
      end
      if tape.nil?
        puts "No tape found for #{tape_media_id} (#{segment.media_id})"
      else
        raise "Couldn't update #{segment.media_id}!" unless segment.update_attribute :tape_id, tape.id
        tape_ids_updated += 1
      end
      if tape_ids_updated % 50 == 1
        STDOUT.printf '.'
        STDOUT.flush
      end
    end
    puts "\nUpdated #{tape_ids_updated} segments. done.\n"


    # 3. Correct segment ordering
    # Reorder all segments for tapes that have segments with duration null
    conditions = "segments.duration IS NULL"
    group = "tapes.id"

    missing_tapes = []
    reordered_tapes = []

    total = Segment.count(:all, :joins => joins, :conditions => conditions, :group => group).size

    puts "\nCorrecting #{total} tapes for missing durations and segment media_id/timecode mismatch:"

    Segment.find(:all, :joins => joins, :conditions => conditions, :group => "tapes.id").each do |segment|

      tape_media_id = segment.media_id[/^za\d{3}_\d{2}_\d{2}/i].upcase

      if segment.tape.nil?
        puts "No tape #{tape_media_id} found for Segment: #{segment.inspect}"
        missing_tapes << tape_media_id
        next

      else
        unless reordered_tapes.include?(tape_media_id)
          tape = segment.tape
          batch = 25
          offset = 0
          total = tape.segments.size

          while offset < total
            Segment.find(:all, :conditions => ['tape_id = ?', tape.id], :order => 'timecode ASC', :limit => "#{offset},#{batch}").each do |s|
              offset += 1
              s.update_attribute :media_id, (tape.media_id + "_#{offset.to_s.rjust(4,'0')}")
            end
            STDOUT.printf '.'
            STDOUT.flush
          end

          reordered_tapes << tape_media_id
        end


      end

    end

    puts "\nReordered #{reordered_tapes.size} tapes."

    puts "\n#{missing_tapes.uniq.size} missing tape media id's:"
    # now for the missing tapes:
    missing_tapes.uniq.each do |tape_media_id|
      puts "Missing tape: #{tape_media_id}"
    end

    puts "\ndone."

    puts "\nNow you should run 'rake data:segment_duration' again."

  end


  desc "Removes headings from interview segments"
  task :remove_headings, [:id, :ids] => :environment do |task, args|
    ids = args[:id] || args[:ids]
    if ids.blank?
      joins = ''
      conditions = ''
    else
      joins = 'RIGHT JOIN tapes ON segments.tape_id = tapes.id RIGHT JOIN interviews ON interviews.id = tapes.interview_id'
      conditions = "interviews.archive_id IN ('#{ids.split(/\W/).join("','")}') AND "
    end

    conditions << "(segments.mainheading IS NOT NULL OR segments.subheading IS NOT NULL)"

    offset = 0
    batch = 100
    total = Segment.count(:all, :joins => joins, :conditions => conditions)

    removed_headings = []

    puts "Removing headings from #{total} segments:"

    while offset < total

      Segment.find(:all, :joins => joins, :conditions => conditions, :limit => "0,#{batch}", :readonly => false).each do |segment|
        if segment.update_attributes({ :mainheading => nil, :subheading => nil })
          archive_id = segment.media_id[/^\w{2}\d{3}/].downcase
          removed_headings << archive_id unless removed_headings.include?(archive_id)
        end
      end

      STDOUT.printf '.'
      STDOUT.flush

      offset += batch
    end

    puts "\nRemoved headings from:\n#{removed_headings.uniq.sort.join('\n')}\n"

    puts "done."

  end


end