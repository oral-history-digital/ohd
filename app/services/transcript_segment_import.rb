# Applies validated transcript rows to one tape in a single transaction.
class TranscriptSegmentImport
  # @param tape [Tape] Destination tape scoped to the upload's interview
  # @param locale [String] Transcript locale
  # @param options [Hash] Replacement and speaker settings
  def initialize(tape, locale, options)
    @tape = tape
    @interview = tape.interview
    @locale = locale
    @options = options
  end

  # @param rows [Array<Hash>] Validated start timecodes, durations, text, and source locations
  # @return [void]
  # @raise [Timecode::ImportFormatError] If a timecode cannot be matched or saved
  def call(rows)
    @interview.with_lock(requires_new: true) do
      (@options[:contributions_attributes] || {}).each_value do |attributes|
        @interview.contributions.find(attributes[:id]).update!(speaker_designation: attributes[:speaker_designation])
      end

      speakers = @interview.contributions.reload.select { |contribution| contribution.speaker_designation.present? }
      speakers_by_designation = speakers.group_by(&:speaker_designation)
      rows.each do |row|
        row[:speaker_ids] = speakers_by_designation.fetch(row[:speaker], []).map(&:person_id).uniq
        row[:speaker_id] = row[:speaker_ids].first
      end

      if @options[:delete_existing]
        @tape.segments.each(&:destroy!)
      else
        match_segments(rows)
      end

      rows.each do |row|
        speaker_id = row[:speaker_id]
        segment = row[:segment] || @tape.segments.build(interview_id: @interview.id, timecode: row[:timecode])
        if @options[:update_only_speakers] && speaker_id
          segment.update!(speaker_id: speaker_id)
        else
          attributes = { text: row[:transcript] || '', locale: @locale, speaker_id: speaker_id }
          attributes[:duration] = row[:duration] if row[:duration]&.positive?
          segment.update!(attributes)
        end
      rescue ActiveRecord::RecordInvalid => e
        raise unless e.record.errors[:timecode].any?

        raise Timecode::ImportFormatError,
              "#{row[:location]}: start timecode #{row[:original]}. #{e.record.errors[:timecode].join('. ')}"
      end
    end
  end

  private

  # Resolves update targets by timecode, using the speaker when a start time is shared.
  #
  # @param rows [Array<Hash>] Parsed rows with candidate speaker IDs
  # @return [void]
  # @raise [Timecode::ImportFormatError] If a row cannot identify a unique segment
  def match_segments(rows)
    by_timecode = rows.group_by { |row| row[:timecode] }
    existing = @tape.segments.where(interview_id: @interview.id, timecode: by_timecode.keys).group_by(&:timecode)
    errors = []

    by_timecode.each do |timecode, matching_rows|
      candidates = existing.fetch(timecode, [])
      if matching_rows.one? && candidates.size <= 1
        matching_rows.first[:segment] = candidates.first
        next
      end

      rows_per_speaker = matching_rows.map { |row| row[:speaker_id] }.tally
      candidates_by_speaker = candidates.group_by(&:speaker_id)
      matching_rows.each do |row|
        speaker_id = row[:speaker_id]
        matches = candidates_by_speaker.fetch(speaker_id, [])
        if row[:speaker_ids].one? && speaker_id && rows_per_speaker[speaker_id] == 1 &&
           (candidates.empty? || matches.one?)
          row[:segment] = matches.first
        else
          errors << "#{row[:location]}: timecode #{row[:original]} is shared. " \
                    'Use a recognized speaker designation that identifies a single segment and appears once at this timecode in the file.'
        end
      end
    end

    raise Timecode::ImportFormatError, errors.join("\n") if errors.any?
  end
end
