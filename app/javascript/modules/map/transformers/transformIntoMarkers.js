import { MARKER_COLOR_MULTIPLE_TYPES } from '../constants';

export default function transformIntoMarkers(colorMap, locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const markers = locations.map(location => {
        if (isEmpty(location.lat) || isEmpty(location.lon)) {
            throw new ReferenceError(`Lat/Lon values are empty for id ${location.id}`);
        }

        const aggregatedRefCounts = Object.values(location.ref_types);
        const totalRefCount = aggregatedRefCounts.reduce((acc, cur) => acc + cur, 0);
        const segmentRefCount = location.ref_types.segment || 0;
        const metadataRefCount = totalRefCount - segmentRefCount;

        return {
            id: location.id,
            lat: location.lat,
            long: location.lon,
            labels: location.labels,
            numReferences: totalRefCount,
            numMetadataReferences: metadataRefCount,
            numSegmentReferences: segmentRefCount,
            radius: markerRadius(metadataRefCount),
            color: color(colorMap, location),
        };
    });

    return markers;
}

function isEmpty(geoCoordinate) {
    return (typeof geoCoordinate === 'undefined' || geoCoordinate === null || Number.isNaN(geoCoordinate));
}

function markerRadius(numMetadataReferences) {
    return Math.cbrt(numMetadataReferences + 3) * 4;
}

function color(colorMap, location) {
    const refTypesClone = {...location.ref_types};
    delete refTypesClone.segment;
    const refTypesWithoutSegment = Object.keys(refTypesClone);

    if (refTypesWithoutSegment.length > 1) {
        return MARKER_COLOR_MULTIPLE_TYPES;
    } else if (refTypesWithoutSegment.length === 1) {
        return colorMap.get(refTypesWithoutSegment[0]);
    } else {
        return colorMap.get('segment');
    }
}
