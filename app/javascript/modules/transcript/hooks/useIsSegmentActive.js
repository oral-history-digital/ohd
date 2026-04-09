import { isSegmentActive } from 'modules/interview-helpers';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { useSelector } from 'react-redux';

/**
 * Determines if a segment is currently "active" (being played).
 * Uses Redux selectors to avoid re-rendering on every media tick.
 *
 * A segment is considered active when:
 * - Interview has transcript_coupled enabled
 * - isSegmentActive helper returns true (checks tapes and times)
 * - No segment is currently being edited (editingSegmentIdRef.current === null)
 *
 * Returns a boolean that only changes when the segment's actual active state changes.
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.segment - The segment object with tape_nbr and time
 * @param {Object} options.interview - The interview object with transcript_coupled flag
 * @param {number} options.nextSegmentTape - The tape number of the next segment
 * @param {number} options.nextSegmentTime - The time of the next segment
 * @param {Object} options.editingSegmentIdRef - Ref to current editing segment ID
 *
 * @returns {boolean} Whether this segment is currently active
 */
export function useIsSegmentActive({
    segment,
    interview,
    nextSegmentTape,
    nextSegmentTime,
    editingSegmentIdRef,
}) {
    return useSelector((state) => {
        if (!interview?.transcript_coupled) return false;
        return (
            isSegmentActive({
                thisSegmentTape: segment.tape_nbr,
                thisSegmentTime: segment.time,
                nextSegmentTape,
                nextSegmentTime,
                currentTape: getCurrentTape(state),
                currentTime: getMediaTime(state),
            }) && editingSegmentIdRef?.current === null
        );
    });
}
