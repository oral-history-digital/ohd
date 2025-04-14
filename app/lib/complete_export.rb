class CompleteExport

  attr_accessor :project, :interview

  def initialize(archive_id, project)
    @project = project
    @interview = Interview.find_by_archive_id(archive_id)
  end

  def process
    Zip::OutputStream.write_buffer do |zip|
      if interview.segments.count > 0
        tape_count = format('%02d', interview.tape_count)
        interview.alpha3s.each do |locale|
          if interview.has_transcript?(locale)
            zip.put_next_entry("#{interview.archive_id}_transcript_#{locale}.pdf")
            zip.write(interview.to_pdf(:de, locale))
          end
          interview.tapes.each do |tape|
            tape_number = format('%02d', tape.number)
            trans = interview.alpha3 == locale ? 'tr' : 'ue'
            filename = "#{interview.archive_id}_#{tape_count}_#{tape_number}_#{trans}_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}"

            zip.put_next_entry("#{filename}.vtt")
            zip.write interview.to_vtt(locale, tape_number)

            zip.put_next_entry("#{filename}.csv")
            zip.write interview.to_csv(locale, tape_number)
          end
        end
      end

      project.available_locales.each do |locale|
        if interview.interviewee.biography_public? && interview.interviewee.has_biography?(locale)
          zip.put_next_entry("#{interview.archive_id}_biography_#{locale}.pdf")
          zip.write(interview.biography_pdf(:de, locale))
        end
        if interview.has_protocol?(locale) && properties[:public_attributes] &&
            properties[:public_attributes]['observations']
          zip.put_next_entry("#{interview.archive_id}_protocol_#{locale}.pdf")
          zip.write(interview.observations_pdf(:de, locale))
        end
      end

      if interview.segments.count > 0
        zip.put_next_entry("#{interview.archive_id}_er_#{DateTime.now.strftime("%Y_%m_%d")}.csv")
        zip.write(EditTableExport.new(interview.archive_id, :de).process)
      end

      zip.put_next_entry("#{interview.archive_id}_metadata_datacite_#{DateTime.now.strftime("%Y_%m_%d")}.xml")
      zip.write(interview.metadata_xml(:de))

      if interview.photos.count > 0
        zip.put_next_entry("#{interview.archive_id}_photos_#{DateTime.now.strftime("%Y_%m_%d")}.zip")
        photos_zip = PhotoExport.new(interview.archive_id, project, true).process
        photos_zip.rewind
        zip.write photos_zip.read
      end
    end
  end

end
