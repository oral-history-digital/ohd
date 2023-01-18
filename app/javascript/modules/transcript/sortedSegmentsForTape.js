export default function sortedSegmentsForTape(props, tape) {
    let sorted = [];

    if (props.interview?.segments && Object.keys(props.interview.segments[tape]).length > 0) {
        sorted = Object.values(props.interview.segments[tape]).sort((a, b) =>{return a.time - b.time})
    }
    return sorted;
}
