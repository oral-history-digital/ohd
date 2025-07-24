export function segmentsForTape(interview, tape) {
    return (interview && interview.segments && interview.segments[tape]) || {};
}
