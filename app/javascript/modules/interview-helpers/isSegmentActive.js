// Segment times are shifted forward by some milliseconds.
// Otherwise, when clicking a segment sometimes the segment before
// is highlighted for a moment.
const TIME_SHIFT = 0.05; // 50ms

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
        (currentTape === thisSegmentTape &&
            currentTime >= thisSegmentTime - TIME_SHIFT) ||
        currentTape > thisSegmentTape
    ) {
        isBehindThisSegment = true;
    }

    if (
        (typeof nextSegmentTape === 'undefined' &&
            typeof nextSegmentTime === 'undefined') ||
        (currentTape === nextSegmentTape &&
            currentTime < nextSegmentTime - TIME_SHIFT) ||
        currentTape < nextSegmentTape
    ) {
        isBeforeNextSegment = true;
    }

    return isBehindThisSegment && isBeforeNextSegment;
}
