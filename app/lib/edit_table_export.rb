class EditTableExport

  attr_accessor :interview, :locale, :contributions, :original_locale

  def initialize(public_interview_id, locale)
    @interview = Interview.find_by_archive_id(public_interview_id)
    @locale = locale
    @contributions = @interview.contributions_hash
    @original_locale = @interview.alpha3.to_s
  end

  def process
    CSV.generate(**CSV_OPTIONS.merge(headers: true)) do |f|

      f << interview.edit_table_headers(@locale).values

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
          text_orig = original&.text&.gsub(/[\t\n\r]+/, ' ') || original_public&.text&.gsub(/[\t\n\r]+/, ' ')

          registry_references = segment.registry_references.map{|r| r.registry_entry_id}.compact.uniq.join('#')

          f << [
            tape.number,
            segment.timecode,
            contributions[segment.speaker_id],
            text_orig.blank? ? nil : text_orig,
          ] + translations(segment) + headings(segment) + [
            registry_references.blank? ? nil : registry_references,
          ] + annotations(segment)
        end
      end
    end
  end

  def translations(segment)
    segment.interview.translation_alpha3s.map do |alpha3|
      translation = segment.translations.where(locale: alpha3).first
      translation_public = segment.translations.where(locale: "#{alpha3}-public").first
      text_trans = translation&.text&.gsub(/[\t\n\r]+/, ' ') || translation_public&.text&.gsub(/[\t\n\r]+/, ' ')
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

  def annotations(segment)
    segment.interview.alpha3s.map do |alpha3|
      segment.annotations.map do |a|
        a.text(alpha3).blank? ? '' : a.text(alpha3).gsub(/[\t\n\r]+/, ' ')
      end.join('#')
    end
  end

end
