/**
 * Returns the segments for a given tape from the interview object.
 *
 * If the interview or the segments for the specified tape do not exist,
 * returns an empty object.
 *
 * @param {Object} interview - The interview object containing segments.
 * @param {number|string} tape - The tape identifier to look up.
 * @returns {Object} The segments for the specified tape, or an empty object if not found.
 */
export function segmentsForTape(interview, tape) {
    return (interview && interview.segments && interview.segments[tape]) || {};
}
