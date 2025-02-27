namespace :repair do

  desc 'remove alpha2 segment translations'
  task remove_alpha2_segment_translations: :environment do
    Segment::Translation.where("char_length(locale) = 2").delete_all
  end

  desc 'remove empty segment translations'
  task remove_empty_segment_translations: :environment do
    ActiveRecord::Base.connection.execute <<-SQL     
      DELETE FROM segment_translations     
      WHERE mainheading IS NULL AND subheading IS NULL AND text IS NULL
    SQL
  end

  desc 'remove doubled segment translations without headings'
  task remove_doubled_segment_translations: :environment do
    #Segment::Translation.
      #where(mainheading: ['', nil], subheading: ['', nil]).
      #group("segment_id", "locale", "text").
      #having("count(segment_id) > 1").each do |segment_translation|
        #segment = segment_translation.segment
        #locale = segment_translation.locale

        #segment.translations.where(locale: locale).
          #order("id DESC").offset(1).delete_all
    #end

    # The following pure SQL-Query does the same as the above Ruby-Code
    # but it takes too much memory for the configuration of the live system
    # 
    # the second subquery is fake to make the query work
    # mysql would otherwise complain with:
    # "You can't specify target table 'segment_translations' for update in FROM clause"
    ActiveRecord::Base.connection.execute <<-SQL     
      DELETE FROM segment_translations     
      WHERE mainheading IS NULL AND subheading IS NULL AND id NOT IN (
        SELECT tid FROM (
          SELECT MAX(id) AS tid
          FROM segment_translations
          GROUP BY segment_id, locale, text
        ) AS t
      )     
    SQL
  end

  desc 'remove doubled segment translations with headings'
  task remove_doubled_segment_translations_with_headings: :environment do
    Segment::Translation.group("segment_id", "locale").
      having("count(segment_id) > 1").each do |segment_translation|
        segment = segment_translation.segment
        locale = segment_translation.locale

        newest_mainheading = segment.translations.where(locale: locale).
          where.not(mainheading: [nil, '']).order("id DESC").first&.mainheading
        newest_subheading = segment.translations.where(locale: locale).
          where.not(subheading: [nil, '']).order("id DESC").first&.subheading
        newest_text = segment.translations.where(locale: locale).
          where.not(text: [nil, '']).order("id DESC").first&.text

        # delete all translations except the newest one
        segment.translations.where(locale: locale).
          order("id DESC").offset(1).delete_all

        # update the newest translation with the newest headings and text
        segment.translations.where(locale: locale).first.
          update(mainheading: newest_mainheading, subheading: newest_subheading, text: newest_text)
      end
  end

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
