# frozen_string_literal: true

# Maintenance helpers for repairing historical data outside normal save paths.
module Maintenance
  # Converts supported historical segment timecodes using explicit legacy rules.
  # This cleanup is not a validator or normalizer for future application saves.
  class LegacyTimecodeNormalizer
    # Normalizes known legacy segment formats without guessing missing digits.
    # Two-digit dot/comma/colon suffixes represent frames at 25 fps; three-digit
    # dot/comma/colon suffixes represent milliseconds. Tape prefixes and paired
    # angle brackets are removed without changing the band-relative time.
    # Four-digit fractions are truncated to three millisecond digits.
    # Component widths are normalized; hours may exceed 99, while minutes and
    # seconds must remain below 60.
    #
    # @param value [String, nil] Stored timecode
    # @return [String] Timecode in HH:MM:SS.mmm format with at least two hour digits
    # @raise [ArgumentError] If the format or time components are unsupported
    def self.normalize(value)
      raise ArgumentError, 'Timecode is empty' if value.nil? || value.strip.empty?

      timecode = value.strip
      # Remove paired angle brackets around the timecode, if present.
      timecode = timecode[1...-1].strip if timecode.start_with?('<') && timecode.end_with?('>')
      # Remove a leading numeric tape marker before parsing.
      timecode = timecode.sub(/\A\[\d+\]\s*/, '')
      # Capture H:M:S digit sequences of any width and an optional two-to-four-digit suffix.
      match = /\A(\d+):(\d+):(\d+)(?:([.,:])(\d{2,4}))?\z/.match(timecode)
      raise ArgumentError, 'Unsupported format or invalid time components' unless match

      hours, minutes, seconds = match.captures.first(3).map(&:to_i)
      raise ArgumentError, 'Minutes and seconds must be in the range 00–59' if minutes > 59 || seconds > 59

      fraction = match[5]
      milliseconds = 0
      if fraction
        if fraction.length == 2
          raise ArgumentError, 'Two-digit suffix must be frames in the range 00–24 (25 fps)' unless fraction.to_i < 25

          milliseconds = fraction.to_i * 40
        else
          milliseconds = fraction[0, 3].to_i
        end
      end
      format('%<hours>02d:%<minutes>02d:%<seconds>02d.%<milliseconds>03d',
             hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds)
    end
  end
end
