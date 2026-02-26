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
 * @param {string|null|undefined} prevTimecode - Timecode of the previous segment
 * @param {string|null|undefined} nextTimecode - Timecode of the next segment
 * @param {'ms'|'frames'|null} [format=null] - Detected timecode format of the
 *   interview. 'ms' = HH:MM:SS.mmm, 'frames' = HH:MM:SS.ff (25fps).
 *   When null, falls back to ms-style defaults.
 * @returns {JSX.Element|string|Array} React element or translation result with localized help text
 *
 * @example
 * // Both constraints (ms format)
 * getTimecodeHelpText(t, '00:01:00.000', '00:02:00.000', 'ms')
 * // => "Allowed: 00:01:00.000 to 00:02:00.000"
 *
 * @example
 * // Only previous constraint (frames format)
 * getTimecodeHelpText(t, '00:01:00.00', null, 'frames')
 * // => "Allowed: > 00:01:00.00"
 *
 * @example
 * // No constraints, frames format
 * getTimecodeHelpText(t, null, null, 'frames')
 * // => "Format: HH:MM:SS or HH:MM:SS.ff"
 */
export function getTimecodeHelpText(
    t,
    prevTimecode,
    nextTimecode,
    format = null
) {
    // Use format-appropriate zero timecode as default for the first segment
    const zeroTimecode = format === 'frames' ? '00:00:00.00' : '00:00:00.000';
    const prev = prevTimecode || zeroTimecode;

    if (!nextTimecode) {
        // Last segment or no constraints
        if (!prevTimecode) {
            const formatKey =
                format === 'frames'
                    ? 'edit.segment.timecode_format_frames'
                    : 'edit.segment.timecode_format';
            return t(formatKey);
        }
        return t('edit.segment.timecode_range_prev_only', {
            prev: prevTimecode,
        });
    }

    // Has next constraint (with either real prev or default zero timecode)
    return t('edit.segment.timecode_range_both', {
        prev,
        next: nextTimecode,
    });
}
