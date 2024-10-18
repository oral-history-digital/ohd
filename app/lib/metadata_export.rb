class MetadataExport

  attr_accessor :archive_ids, :project, :locale

  def initialize(archive_ids, project, locale)
    I18n.locale = locale
    @archive_ids = archive_ids
    @project = project
    @locale = locale
  end

  def process
    CSV.generate(**CSV_OPTIONS.merge(headers: true)) do |f|
      f << MetadataImportTemplate.new(project, locale).columns_hash.values
      Interview.where(archive_id: archive_ids).each do |interview|

        line = [
          interview.archive_id,
          interview.signature_original,
          interview.primary_language.name(locale),
          interview.secondary_language&.name(locale),
          interview.primary_translation_language&.name(locale),
          interview.collection && interview.collection.name(locale),
          interview.interview_date,
          interview.media_type,
          Timecode.new(interview.duration).timecode,
          interview.observations(locale) && interview.observations(locale).gsub(/[\r\n\t]/, ' '),
          interview.description(locale) && interview.description(locale).gsub(/[\r\n\t]/, ' '),
          interview.tape_count,
          interview.properties[:link],
          interview.interviewee.first_name,
          interview.interviewee.last_name,
          interview.interviewee.birth_name,
          interview.interviewee.alias_names,
          interview.interviewee.other_first_names,
          interview.interviewee.pseudonym_first_name,
          interview.interviewee.pseudonym_last_name,
          interview.interviewee.use_pseudonym,
          interview.interviewee.description,
          interview.interviewee.gender,
          interview.interviewee.date_of_birth,
          interview.interviewee.biography(locale) && interview.interviewee.biography(locale).gsub(/[\r\n\t]/, ' '),
          interview.interviewee.biography_public?,
        ]

        project.contribution_types.inject(line) do |mem, contribution_type|
          if contribution_type.use_in_export# && contribution_type.code != 'interviewee'
            contributors = interview.contributors_by_code(contribution_type.code)
            mem << (contributors.count > 0 ? contributors.map{|c| "#{c.last_name}, #{c.first_name}"}.join('#') : nil)
          end
          mem
        end

        project.registry_reference_type_import_metadata_fields.inject(line) do |mem, field|
          registry_entries = (field.ref_object_type == 'Interview' ? interview : interview.interviewee).
            registry_references_by_metadata_field_name(field.name).map do |rr|
              RegistryEntry.find(rr.registry_entry_id)
            end.compact.uniq
          mem << registry_entries.map(&:descriptor).join('#')
          parent = registry_entries.first&.parents&.first
          if parent && parent.id != field.registry_reference_type.registry_entry_id
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
