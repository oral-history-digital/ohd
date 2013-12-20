namespace :data do

  desc "print out a list of all interviews with imported captions"
  task :interviews_with_captions => :environment do

    joins =  "RIGHT JOIN tapes ON tapes.interview_id = interviews.id RIGHT JOIN segments ON segments.tape_id = tapes.id"
    cond = "segments.id IS NOT NULL"

    ids = Interview.all(:select => 'archive_id', :joins => joins, :conditions => cond, :group => 'interviews.id').map(&:archive_id)

    puts "\nInterviews with captions:"

    ids.sort.each do |archive_id|

      puts archive_id

    end

    puts "\ndone."

  end

  desc "Report on archive contents"
  task :content_report => :environment do

    @interviews = Interview.all
    last_import = Import.all.last
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
