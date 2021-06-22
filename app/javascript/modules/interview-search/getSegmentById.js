export default function getSegmentById(segments, segmentId) {
    // Preconditions
    if (typeof segments !== 'object') {
        throw new TypeError('segments argument must be object');
    }
    if (Object.keys(segments).length === 0) {
        throw new ReferenceError('segments object must not be empty');
    }
    if (typeof segmentId !== 'number') {
        throw new TypeError('segmentId argument must be number');
    }
    if (typeof segmentId < 0) {
        throw new TypeError('segmentId must not be negative');
    }

    const segmentArray = Object.values(segments);

    const obj = Object.assign.apply(null, [{}].concat(segmentArray));

    const segment = obj[segmentId];

    if (typeof segment === 'undefined') {
        throw new ReferenceError('Segment cannot be found');
    }

    return segment;
}
