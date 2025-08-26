/**
 * Returns a sorted array of segments for a given tape from the interview object in props.
 *
 * If the interview or the segments for the specified tape do not exist or are empty,
 * returns an empty array.
 *
 * @param {Object} props - The props object containing the interview and its segments.
 * @param {number|string} tape - The tape identifier to look up.
 * @returns {Array} Sorted array of segment objects for the specified tape, or an empty array if not found.
 */
export function sortedSegmentsForTape(props, tape) {
    let sorted = [];

    if (
        props.interview?.segments?.[tape] &&
        Object.keys(props.interview.segments[tape]).length > 0
    ) {
        sorted = Object.values(props.interview.segments[tape]).sort((a, b) => {
            return a.time - b.time;
        });
    }
    return sorted;
}
