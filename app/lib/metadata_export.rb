class MetadataExport

  attr_accessor :archive_ids, :project, :locale

  def initialize(archive_ids, project, locale)
    I18n.locale = locale
    @archive_ids = archive_ids
    @project = project
    @locale = locale
  end

  def process
    CSV.generate(headers: true, col_sep: "\t", row_sep: :auto, quote_char: "\x00") do |f|
      f << MetadataImportTemplate.new(project, locale).columns_hash.values
      Interview.where(archive_id: archive_ids).each do |interview|

        line = [
          interview.archive_id,
          interview.signature_original,
          interview.language.name(locale),
          interview.collection && interview.collection.name(locale),
          interview.interview_date,
          interview.media_type,
          Timecode.new(interview.duration).timecode,
          interview.observations(locale) && interview.observations(locale).gsub(/[\r\n]/, ' '),
          interview.description(locale) && interview.description(locale).gsub(/[\r\n]/, ' '),
          interview.tape_count,
          interview.properties[:link],
          interview.interviewee.first_name,
          interview.interviewee.last_name,
          interview.interviewee.birth_name,
          interview.interviewee.alias_names,
          interview.interviewee.other_first_names,
          interview.interviewee.gender,
          interview.interviewee.date_of_birth,
          interview.interviewee.biography(locale) && interview.interviewee.biography(locale).gsub(/[\r\n]/, ' '),
          interview.interviewers.count > 0 ? interview.interviewers.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#') : nil,
          interview.transcriptors.count > 0 ? interview.transcriptors.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#') : nil,
          interview.translators.count > 0 ? interview.translators.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#') : nil,
          interview.researches.count > 0 ? interview.researches.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#') : nil,
        ]

        project.registry_reference_type_import_metadata_fields.inject(line) do |mem, field|
          registry_entries = interview.send(field.name).map{|rid| RegistryEntry.find(rid)}.compact.uniq
          mem << registry_entries.map(&:descriptor).join('#')
          parent = registry_entries.first && registry_entries.first.parents.first
          if parent
            mem << parent.descriptor
          else
            mem << nil
          end
          mem
        end

        f << line
      end
    end
  end
end
