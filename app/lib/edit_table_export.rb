class EditTableExport

  attr_accessor :interview, :contributions, :original_locale, :translation_locale

  def initialize(public_interview_id)
    @interview = Interview.find_by_archive_id(public_interview_id)
    @contributions = @interview.contributions_hash
    @original_locale = @interview.lang.to_s
    @translation_locale = (@interview.languages - [@interview.lang]).first ||
      (@interview.project.available_locales - [@interview.lang]).first.to_s
  end

  def process
    CSV.generate(headers: true, col_sep: "\t", row_sep: :auto, quote_char: "\x00") do |f|

      f << [
        'Band',
        'Timecode',
        'Sprecher',
        'Transkript',
        'Übersetzung',
        'Hauptüberschrift',
        'Zwischenüberschrift',
        'Hauptüberschrift (Übersetzung)',
        'Zwischenüberschrift (Übersetzung)',
        'Registerverknüpfungen',
        'Anmerkungen',
        'Anmerkungen (Übersetzung)'
      ]

      interview.tapes.includes(
        segments: [
          :translations,
          {annotations: :translations},
          {registry_references: {registry_entry: {registry_names: :translations}}}
        ]
      ).each do |tape|
        tape.segments.each do |segment|

          segment_locales = segment.translations.map{|t| t.locale.to_s}
          segment_original_locale = segment_locales.include?(original_locale) ? original_locale : "#{original_locale}-public"
          segment_translation_locale = segment_locales.include?(translation_locale) ? translation_locale : "#{translation_locale}-public"

          original = segment.translations.where(locale: segment_original_locale).first
          translation = segment.translations.where(locale: segment_translation_locale).first

          text_orig = original && original.text && original.text.gsub(/[\t\n\r]+/, ' ')
          text_trans = translation && translation.text && translation.text.gsub(/[\t\n\r]+/, ' ')
          mainheading_orig = original && original.mainheading
          subheading_orig = original && original.subheading
          mainheading_trans = translation && translation.mainheading
          subheading_trans = translation && translation.subheading
          registry_references = segment.registry_references.map{|r| r.registry_entry_id}.compact.uniq.join('#')
          annotations = segment.annotations.map{|a| a.text(original_locale).gsub(/[\t\n\r]+/, ' ')}.join('#')
          annotations_trans = segment.annotations.map{|a| a.text(translation_locale).gsub(/[\t\n\r]+/, ' ')}.join('#')

          f << [
            tape.number,
            segment.timecode,
            contributions[segment.speaker_id],
            text_orig.blank? ? nil : text_orig,
            text_trans.blank? ? nil : text_trans,
            mainheading_orig.blank? ? nil : mainheading_orig,
            subheading_orig.blank? ? nil : subheading_orig,
            mainheading_trans.blank? ? nil : mainheading_trans,
            subheading_trans.blank? ? nil : subheading_trans,
            registry_references.blank? ? nil : registry_references,
            annotations.blank? ? nil : annotations,
            annotations_trans.blank? ? nil : annotations_trans
          ]
        end
      end
    end
  end

end
