export default function isSegmentActive({
    thisSegmentTape,
    thisSegmentTime,
    nextSegmentTape,
    nextSegmentTime,
    currentTape,
    currentTime,
}) {
    let isBehindThisSegment = false;
    let isBeforeNextSegment = false;

    if (
        currentTape === thisSegmentTape && currentTime >= thisSegmentTime ||
        currentTape > thisSegmentTape
    ) {
        isBehindThisSegment = true;
    }

    if (
        typeof nextSegmentTape === 'undefined' && typeof nextSegmentTime === 'undefined' ||
        currentTape === nextSegmentTape && currentTime < nextSegmentTime ||
        currentTape < nextSegmentTape
    ) {
        isBeforeNextSegment = true;
    }

    return isBehindThisSegment && isBeforeNextSegment;
}
