class EditTableExport

  attr_accessor :file_path, :interview, :contributions, :original_locale, :translation_locale

  def initialize(public_interview_id)
    @interview = Interview.find_by_archive_id(public_interview_id)
    @contributions = @interview.contributions.inject({}) do |mem, c|
      mem[c.person_id] = c.speaker_designation
      mem
    end
    @original_locale = @interview.lang
    @translation_locale = (@interview.languages - [@interview.lang]).first
    @file_path = File.join(Rails.root, 'tmp', 'files', "#{@interview.archive_id}_er_#{DateTime.now.strftime("%Y-%m-%d")}.csv")
  end

  def process
    CSV.open(file_path, 'w', col_sep: "\t") do |f|

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
        'Anmerkungen'
      ]

      interview.tapes.includes(
        segments: [
          :translations,
          {annotations: :translations},
          {registry_references: {registry_entry: {registry_names: :translations}}}
        ]
      ).each do |tape|
        tape.segments.each do |segment|

          segment_locales = segment.translations.map(&:locale)
          segment_original_locale = segment_locales.include?(original_locale) ? original_locale : "#{original_locale}-public"
          segment_translation_locale = segment_locales.include?(translation_locale) ? translation_locale : "#{translation_locale}-public"

          f << [
            segment.tape_number,
            segment.timecode,
            contributions[segment.speaker_id],
            segment.text(segment_original_locale),
            segment.text(segment_translation_locale),
            segment.mainheading(segment_original_locale),
            segment.subheading(segment_original_locale),
            segment.mainheading(segment_translation_locale),
            segment.subheading(segment_translation_locale),
            segment.registry_references.compact.uniq.map{|r| r.registry_entry.descriptor(:de).gsub(/[\t\n\r]+/, ' ')}.join('#'),
            segment.annotations.compact.uniq.map{|a| a.text(:de).gsub(/[\t\n\r]+/, ' ')}.join('#')
          ]
        end
      end
    end
    file_path
  end

end
