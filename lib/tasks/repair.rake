namespace :repair do

  desc 'add a default tape to interviews that do not have at least one tape'
  task :add_default_tape => :environment do
    Interview.left_outer_joins(:tapes).where(tapes: {id: nil}).each do |i| 
      puts "creating tape for interview #{i.archive_id}"
      Tape.create interview_id: i.id, media_id: "#{i.archive_id.upcase}_01_01", workflow_state: "digitized", time_shift: 0, number: 1 
      i.touch
      puts "   ***   "
    end
  end

  desc 'reimport transcripts'
  task :reimport, [:filename] => :environment do |t, args|
    CSV.foreach(args[:filename], col_sep: "\t", row_sep: :auto, quote_char: "\x00") do |row|
      media_id, transcript, translation = row
      interview = Interview.find_by_archive_id(media_id.split('_').first.downcase)
      if interview
        transcript_locale = interview.lang
        translation_locale = interview.primary_translation_language && ISO_639.find(interview.primary_translation_language.code).try(:alpha2)
        segments = Segment.where(media_id: media_id).to_a
        segment = segments.shift
        segments.each{|s| s.registry_references.update_all(ref_object_id: segment.id)}
        segments.each{|s| s.annotations.update_all(segment_id: segment.id)}
        segments.each(&:destroy)
        if segment
          segment.update(text: transcript&.gsub(/\{\(#ATR: .*\)\}/, ''), locale: transcript_locale)
          if translation_locale
            segment.update(text: translation&.gsub(/\{\(#ATR: .*\)\}/, ''), locale: translation_locale)
          end
        end
      end
    end
  end
end
