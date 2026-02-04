/**
 * Generates help text for the timecode input field showing the allowed range.
 *
 * The help text indicates that the timecode must be strictly between the previous
 * and next segment timecodes. If no constraints exist, shows format information.
 *
 * Returns a React element to prevent double-translation by the Form component.
 * The translation system uses %{variable} interpolation syntax.
 *
 * @param {Function} t - Translation function from useI18n hook
 * @param {string|null|undefined} prevTimecode - Timecode of the previous segment (format: HH:MM:SS or HH:MM:SS.mmm)
 * @param {string|null|undefined} nextTimecode - Timecode of the next segment (format: HH:MM:SS or HH:MM:SS.mmm)
 * @returns {JSX.Element|string|Array} React element or translation result with localized help text
 *
 * @example
 * // Both constraints
 * getTimecodeHelpText(t, '00:01:00', '00:02:00')
 * // => "Allowed range: > 00:01:00 and < 00:02:00" (with interpolation)
 *
 * @example
 * // Only previous constraint
 * getTimecodeHelpText(t, '00:01:00', null)
 * // => "Allowed range: > 00:01:00" (with interpolation)
 *
 * @example
 * // No constraints
 * getTimecodeHelpText(t, null, null)
 * // => "Format: HH:MM:SS or HH:MM:SS.mmm"
 */
export function getTimecodeHelpText(t, prevTimecode, nextTimecode) {
    // Default to 00:00:00.000 if no previous segment exists
    const prev = prevTimecode || '00:00:00.000';

    if (!nextTimecode) {
        // Last segment or no constraints
        if (!prevTimecode) {
            return t('edit.segment.timecode_format');
        }
        return t('edit.segment.timecode_range_prev_only', {
            prev: prevTimecode,
        });
    }

    // Has next constraint (with either real prev or default 00:00:00.000)
    return t('edit.segment.timecode_range_both', {
        prev,
        next: nextTimecode,
    });
}
