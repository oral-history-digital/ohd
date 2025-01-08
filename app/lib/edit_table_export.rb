class EditTableExport

  attr_accessor :interview, :contributions, :original_locale, :translation_locale

  def initialize(public_interview_id)
    @interview = Interview.find_by_archive_id(public_interview_id)
    @contributions = @interview.contributions_hash
    @original_locale = @interview.lang.to_s
    @translation_locale = @interview.translation_lang
  end

  def process
    CSV.generate(**CSV_OPTIONS.merge(headers: true)) do |f|

      f << interview.edit_table_headers.values

      interview.tapes.includes(
        segments: [
          :translations,
          {annotations: :translations},
          {registry_references: {registry_entry: {registry_names: :translations}}}
        ]
      ).each do |tape|
        tape.segments.each do |segment|

          original = segment.translations.where(locale: original_locale).first
          original_public = segment.translations.where(locale: "#{original_locale}-public").first
          translation = segment.translations.where(locale: translation_locale).first
          translation_public = segment.translations.where(locale: "#{translation_locale}-public").first

          text_orig = original&.text&.gsub(/[\t\n\r]+/, ' ') || original_public&.text&.gsub(/[\t\n\r]+/, ' ')
          text_trans = translation&.text&.gsub(/[\t\n\r]+/, ' ') || translation_public&.text&.gsub(/[\t\n\r]+/, ' ')
          registry_references = segment.registry_references.map{|r| r.registry_entry_id}.compact.uniq.join('#')
          annotations = segment.annotations.map{|a| a.text(original_locale).blank? ? '' : a.text(original_locale).gsub(/[\t\n\r]+/, ' ')}.join('#')
          annotations_trans = segment.annotations.map{|a| a.text(translation_locale).blank? ? '' : a.text(translation_locale).gsub(/[\t\n\r]+/, ' ')}.join('#')

          f << [
            tape.number,
            segment.timecode,
            contributions[segment.speaker_id],
            text_orig.blank? ? nil : text_orig,
            text_trans.blank? ? nil : text_trans,
          ] + headings(segment) + [
            registry_references.blank? ? nil : registry_references,
            annotations.blank? ? nil : annotations,
            annotations_trans.blank? ? nil : annotations_trans
          ]
        end
      end
    end
  end

  def headings(segment)
    segment.interview.project.available_locales.map do |locale|
      alpha3 = ISO_639.find(locale).alpha3
      mainheading = segment.mainheading(alpha3) || segment.mainheading("#{alpha3}-public")
      subheading = segment.subheading(alpha3) || segment.subheading("#{alpha3}-public")
      [mainheading, subheading]
    end.flatten
  end

end
