export default function sortedSegmentsForTape(props, tape) {
    let sorted = [];
    if (props.interview && Object.keys(props.interview.segments).length > 0) {
        sorted = Object.values(props.interview.segments[tape]).sort((a, b) =>{return a.time - b.time})
    }
    return sorted;
}