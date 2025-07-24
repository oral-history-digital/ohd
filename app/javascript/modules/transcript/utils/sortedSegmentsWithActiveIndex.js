import { sortedSegmentsWithActiveIndexForTape } from './sortedSegmentsWithActiveIndexForTape';

// props needs to contain: interview, tape

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
