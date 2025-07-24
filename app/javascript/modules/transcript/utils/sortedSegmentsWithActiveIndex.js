import { sortedSegmentsWithActiveIndexForTape } from './sortedSegmentsWithActiveIndexForTape';

/**
 * Returns the active segment, a sorted array of all segments, and the index of the active segment for a given time and tape.
 *
 * Iterates over all tapes in the interview, concatenates sorted segments, and determines the active segment and its index
 * for the specified tape and time using sortedSegmentsWithActiveIndexForTape.
 *
 * @param {number} time - The time to find the active segment for.
 * @param {Object} props - The props object containing interview, tape, and related metadata.
 * @returns {[Object|null, Array, number]} An array containing the active segment (or null), all sorted segments, and the active index.
 */
export function sortedSegmentsWithActiveIndex(time, props) {
    let sortedSegments = [];
    let index = 0;
    let activeSegment = null;

    if (
        props.interview?.segments &&
        props.interview.first_segments_ids &&
        Object.keys(props.interview.first_segments_ids).length > 0
    ) {
        for (var i = 1; i <= parseInt(props.interview.tape_count); i++) {
            if (props.tape === i) {
                let sortedWActiveAIndex = sortedSegmentsWithActiveIndexForTape(
                    time,
                    props
                );
                index = sortedSegments.length + sortedWActiveAIndex[2];
                sortedSegments = sortedSegments.concat(sortedWActiveAIndex[1]);
                activeSegment = sortedWActiveAIndex[0];
            } else if (props.interview.segments[i]) {
                sortedSegments = sortedSegments.concat(
                    Object.values(props.interview.segments[i]).sort((a, b) => {
                        return a.time - b.time;
                    })
                );
            }
        }
    }

    return [activeSegment, sortedSegments, index];
}
