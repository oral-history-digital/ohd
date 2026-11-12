/**
 * Returns localized format or range help for canonical segment timecodes.
 *
 * @param {Function} t - Translation function.
 * @param {string|null|undefined} prevTimecode - Previous segment timecode.
 * @param {string|null|undefined} nextTimecode - Next segment timecode.
 * @returns {string} Localized help text.
 */
export function getTimecodeHelpText(t, prevTimecode, nextTimecode) {
    if (nextTimecode) {
        return t('edit.segment.timecode_range_both', {
            prev: prevTimecode || '00:00:00.000',
            next: nextTimecode,
        });
    }

    if (prevTimecode) {
        return t('edit.segment.timecode_range_prev_only', {
            prev: prevTimecode,
        });
    }

    return t('edit.segment.timecode_format');
}
