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
      interview.tapes.each do |tape|
        tape_number = format('%02d', tape.number)
        interview.languages.each do |locale|
          trans = interview.lang == locale ? 'tr' : 'ue'
          filename = "#{interview.archive_id}_#{tape_count}_#{tape_number}_#{trans}_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}"

          zip_file.add("#{filename}.vtt", interview.to_vtt(locale, tape_number))
          zip_file.add("#{filename}.csv", interview.to_csv(locale, tape_number))
        end
      end

        @lang = "#{@locale}-public"
        @doc_type = 'transcript'
        @lang_human = I18n.t(params[:lang], locale: @locale)
        @orig_lang = "#{interview.lang}-public"
        first_segment_with_heading = interview.segments.with_heading.first
        @lang_headings_exist = !!first_segment_with_heading && (first_segment_with_heading.mainheading(@lang) || first_segment_with_heading.subheading(@lang))
        pdf = render_to_string(:template => '/latex/interview_transcript.pdf.erb', :layout => 'latex.pdf.erbtex')
        zip_file.add("#{interview.archive_id}_transcript_#{@locale}.pdf", pdf)

      zip_file.add("#{interview.archive_id}_er_#{DateTime.now.strftime("%Y_%m_%d")}.xml", EditTableExport.new(params[:id]).process)
      zip_file.add("#{interview.archive_id}_metadata_datacite_#{DateTime.now.strftime("%Y_%m_%d")}.xml", render_to_string(:metadata))


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
