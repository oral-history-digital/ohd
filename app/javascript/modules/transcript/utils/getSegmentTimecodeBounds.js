/**
 * Computes editable timecode bounds for a segment using only neighbors
 * on the same tape.
 *
 * @param {Object|null|undefined} segment - Current segment
 * @param {Object|null|undefined} prevSegment - Previous segment in rendered list
 * @param {Object|null|undefined} nextSegment - Next segment in rendered list
 * @returns {{prevSegmentTimecode: string|undefined, nextSegmentTimecode: string|undefined}}
 */
export function getSegmentTimecodeBounds(segment, prevSegment, nextSegment) {
    const tapeNbr = segment?.tape_nbr;

    return {
        prevSegmentTimecode:
            prevSegment?.tape_nbr === tapeNbr
                ? prevSegment?.timecode
                : undefined,
        nextSegmentTimecode:
            nextSegment?.tape_nbr === tapeNbr
                ? nextSegment?.timecode
                : undefined,
    };
}
