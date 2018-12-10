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

        csv << [c.interview.archive_id, c.interview.interviewees.first.last_name, c.interview.interviewees.first.first_name, c.photo_file_name, c.caption, c.interview.collection.name, dest]
        csv << "\n"
      end
    end
  end

end
