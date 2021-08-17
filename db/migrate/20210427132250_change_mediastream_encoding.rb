class ChangeMediastreamEncoding < ActiveRecord::Migration[5.2]
  def change
    MediaStream.all.each do |m|
      m.update_attributes path: m.path.
        gsub(/#\{archive_id\}/, 'INTERVIEW_ID').
        gsub(/#\{tape_count\}/, 'TAPE_COUNT').
        gsub(/#\{tape_number\}/, 'TAPE_NUMBER')
    end

    path = "https://medien.cedis.fu-berlin.de/#{Project.first.shortname.downcase}/#{Project.first.shortname.downcase}/INTERVIEW_ID/INTERVIEW_ID_2.jpg"

    case Project.first.identifier.to_sym
    when :mog
      path = "https://medien.cedis.fu-berlin.de/eog/interviews/mog/INTERVIEW_ID/INTERVIEW_ID}_2.jpg"
    when :zwar
      path = "https://medien.cedis.fu-berlin.de/zwar/stills/INTERVIEW_ID/_still_original.JPG"
    end

    MediaStream.create(
      project_id: Project.first.id,
      media_type: 'still',
      path: path
    )
  end
end
