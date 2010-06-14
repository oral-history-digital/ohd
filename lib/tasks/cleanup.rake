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


end