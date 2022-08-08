namespace :photo do

  desc 'export photos to csv' 
  task :export_to_csv => :environment do
    #za-Nr, Dateiname des Bildes, Bildunterschrift enthalten sein, wenn möglich auch noch Name, Vorname, Teilsammlung.
    header = "Archiv Id,Name,Vorname,Bildname,Bildunterschrift,Teilsammlung,Pfad"
    file = "photos.csv"
    File.open(file, "w") do |csv|
      csv << header
      Photo.all.each do |c|  
        dest_dir = File.join(
          "storage",
          c.photo.key.first(2),
          c.photo.key.first(4).last(2))
        dest = File.join(dest_dir, c.photo.key)

        csv << "\n"
        csv << [c.interview.archive_id, c.interview.interviewees.first.last_name, c.interview.interviewees.first.first_name, c.photo_file_name, c.caption, c.interview.collection.name, dest].map{|s|s.gsub(/"/, '""')}.map{|s| "\"#{s}\""}.join(",")
      end
    end
  end

  desc 'rewrite IPTC-metadata from all translations'
  task :rewrite_iptc_metadata => :environment do
    Photo.in_batches.each_record do |photo|
      file = MiniExiftool.new ActiveStorage::Blob.service.path_for(photo.photo.key)
      metadata.each do |k,v|
        file[:title] = photo.public_id
        file[:caption] = photo.translations.map(&:caption).join(' ')
        file[:creator] = photo.translations.map(&:photographer).join(' ')
        file[:headline] = photo.translations.map{|t| "#{photo.interview.archive_id} - #{I18n.backend.translate(t.locale, 'interview_with')} #{photo.interview.short_title(t.locale)}"}
        file[:copyright] = photo.translations.map(&:license).join(' ')
        file[:date] = photo.translations.map(&:date).join(' ')
        file[:city] = photo.translations.map(&:place).join(' ')
      end
      file.save
    end
  end

end
