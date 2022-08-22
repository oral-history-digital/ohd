class CompleteExport

  attr_accessor :project, :interview, :tmp_name

  def initialize(archive_id, project)
    @project = project
    @interview = Interview.find_by_archive_id(archive_id)
    @tmp_name = rand(36**8).to_s(36)
  end

  def process
    zip_path = Rails.root.join('tmp', 'files', "#{tmp_name}.zip")

    Zip::File.open(zip_path, create: true) do |zip_file|
      tape_count = format('%02d', interview.tape_count)
      interview.languages.each do |locale|
        interview.tapes.each do |tape|
          tape_number = format('%02d', tape.number)
          trans = interview.lang == locale ? 'tr' : 'ue'
          filename = "#{interview.archive_id}_#{tape_count}_#{tape_number}_#{trans}_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}"

          zip_file.get_output_stream("#{filename}.vtt") {|f| f.puts(interview.to_vtt(locale, tape_number))}
          zip_file.get_output_stream("#{filename}.csv") {|f| f.puts(interview.to_csv(locale, tape_number))}
        end
      end

      project.available_locales.each do |locale|
        zip_file.get_output_stream("#{interview.archive_id}_transcript_#{locale}.pdf") {|f| f.puts(interview.to_pdf(:de, locale))}
        zip_file.get_output_stream("#{interview.archive_id}_biography_#{locale}.pdf") {|f| f.puts(interview.biography_pdf(:de, locale))}
        zip_file.get_output_stream("#{interview.archive_id}_protocol_#{locale}.pdf") {|f| f.puts(interview.observations_pdf(:de, locale))}
      end

      zip_file.get_output_stream("#{interview.archive_id}_er_#{DateTime.now.strftime("%Y_%m_%d")}.xml") {|f| f.puts(EditTableExport.new(interview.archive_id).process)}
      #zip_file.get_output_stream("#{interview.archive_id}_metadata_datacite_#{DateTime.now.strftime("%Y_%m_%d")}.xml") {|f| f.puts(render_to_string(:metadata))}

      project.available_locales.each do |locale|
        zip_file.get_output_stream("#{interview.archive_id}_photos_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}.csv") {|f| f.puts(interview.photos_csv(locale))}
      end
      interview.photos.each do |photo|
        zip_file.add(photo.photo_file_name || photo.photo.blob.filename, ActiveStorage::Blob.service.path_for(photo.photo.key))
      end
    end

    zip_path
  end

end
