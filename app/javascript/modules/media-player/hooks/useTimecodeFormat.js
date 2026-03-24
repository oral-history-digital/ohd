import { usePathBase } from 'modules/routes';
import { detectTimecodeFormat } from 'modules/utils';
import useSWRImmutable from 'swr/immutable';

/**
 * Detects the timecode format ('ms' or 'frames') used by an interview by
 * fetching one of its segments and inspecting its timecode string.
 *
 * @param {Object} interview - The interview object, must include first_segments_ids.
 * @returns {'ms'|'frames'} The detected format, defaulting to 'ms'.
 *
 * TODO: Once timecode format is standardized to milliseconds, this hook can be
 * removed and the format hardcoded to 'ms'.
 */
export function useTimecodeFormat(interview) {
    const pathBase = usePathBase();

    // Pick the first segment ID from tape 1 (or whatever the first key is).
    const firstSegmentsIds = interview?.first_segments_ids ?? {};
    const segmentId = Object.values(firstSegmentsIds)[0] ?? null;

    const { data: segment } = useSWRImmutable(
        segmentId ? `${pathBase}/segments/${segmentId}.json` : null
    );

    return detectTimecodeFormat(segment?.timecode) ?? 'ms';
}
