namespace :storage do

  desc 'imports interview stills'
  task :import_interview_stills => :environment do

    batch = 25
    offset = 0
    total = Interview.count

    puts "Importing interview stills for #{total} interviews:"

    while offset < total do

      Interview.all(:limit => "#{offset},#{batch}", :readonly => false).each do |interview|

        archive_id = interview.archive_id.downcase

        photo_path = File.join(Project.photo_storage_dir, 'interview_stills')

        Dir.glob(File.join(photo_path, "#{archive_id}*")).each do |file|

          file_name = file.split('/').last

          if file_name.match(Regexp.new("^#{Project.project_initials}\\d{3}\\.(png|jpg)$", Regexp::IGNORECASE))

            if interview.still_image_file_name == nil or not File.exist?(interview.still_image_file_name)
              interview.still_image = File.open(file)
              interview.save!
              puts "#{file_name} added"
            end

          end

        end

      end

      offset += batch

    end

  end

  desc 'looks for tapes in the context'
  task :lookup_tapes => :environment do

    joins = 'LEFT JOIN tapes ON tapes.interview_id = interviews.id'
    conditions = 'tapes.id IS NULL'

    batch = 25
    offset = 0
    total = Interview.count(:joins => joins, :conditions => conditions )

    wrong_audio = []
    wrong_video = []

    created_tapes_for = []

    interviews_without_media = []

    puts "Checking media files for #{total} interviews:"

    while offset < total do

      Interview.all(:limit => "#{offset},#{batch}", :joins => joins, :conditions => conditions, :readonly => false).each do |interview|

        dir = interview.archive_id.upcase
        archive_path = File.join(Project.storage_dir, dir, "#{dir}_archive", 'data', 'av')

        puts "ERROR: no archive directory for #{dir}!" unless File.directory?(archive_path)

        # check for video files first:
        [ 'flv', 'mp4' ].each do |type|

          media_count = 0

          Dir.glob(File.join(archive_path, type, "*.#{type}")).each do |file|

            media_id = file.split('/').last.sub(/\.(flv|mp4)$/,'').upcase

            if type == 'flv'

              # create a tape
              if interview.tapes.select{|t| t.media_id == media_id }.empty?
                interview.tapes.create do |tape|
                  tape.media_id = media_id
                  tape.video = true
                end
                created_tapes_for << interview.archive_id unless created_tapes_for.include?(interview.archive_id)
              end

            else

              # check for existing tape
              if interview.tapes.select{|t| t.media_id == media_id }.empty?

                puts 'ERROR: missing mp4 file for ' + media_id + '!'

              end


            end

            media_count += 1

          end

          if media_count > 0 && media_count != interview.tapes.size

            puts "ERROR: found #{media_count} #{type}'s for #{interview.archive_id} which has #{interview.tapes.size} tapes!"

          end

        end


        if interview.tapes.blank? || interview.tapes.empty?

          # check for audio files

          Dir.glob(File.join(archive_path, 'mp3', '*.mp3')).each do |file|

            media_id = file.split('/').last.sub(/\.mp3$/,'')

            # create a tape
            if interview.tapes.select{|t| t.media_id == media_id }.empty?
              interview.tapes.create do |tape|
                tape.media_id = media_id
                tape.video = false
              end
              created_tapes_for << interview.archive_id unless created_tapes_for.include?(interview.archive_id)
            end

          end

          # check the video flag
          if interview.video
            puts "ERROR: #{interview.archive_id} set as video but only has audio media files!"
            wrong_video << interview.archive_id
            interview.update_attribute :video, false
          end

        else

          # check the video flag
          unless interview.video
            puts "ERROR: #{interview.archive_id} set as audio but has video media files!"
            wrong_audio << interview.archive_id
            interview.update_attribute :video, true
          end

        end

        if interview.tapes.blank?
          interviews_without_media << interview.archive_id
        end

      end # interview

      STDOUT.printf '.'
      STDOUT.flush

      offset += batch

    end

    puts "#{total} interviews done."

    puts
    unless wrong_audio.empty?
      puts "Interviews labelled as 'audio' but have video files: #{wrong_audio.join(', ')}"
      puts
    end

    unless wrong_video.empty?
      puts "Interviews labelled as 'video' but have only audio files: #{wrong_video.join(', ')}"
    end

    puts
    puts "Created tapes for #{created_tapes_for.size} interviews: #{created_tapes_for.join(', ')}"

    puts "#{interviews_without_media.size} Interviews without any media remain: #{interviews_without_media.join(', ')}"


  end

end
