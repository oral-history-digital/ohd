import { MARKER_COLOR_MULTIPLE_TYPES } from '../constants';

export default function transformIntoMarkers(colorMap, locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const markers = locations.map(location => {
        if (isEmpty(location.lat) || isEmpty(location.lon)) {
            throw new ReferenceError(`Lat/Lon values are empty for id ${location.id}`);
        }

        const refs = location.ref_types.split(',');
        const numReferences = refs.length;
        const numMetadataReferences = refs.filter(ref => ref !== 'S').length;
        const numSegmentReferences = numReferences - numMetadataReferences;

        return {
            id: location.id,
            lat: Number.parseFloat(location.lat),
            long: Number.parseFloat(location.lon),
            agg_names: location.agg_names,
            numReferences,
            numMetadataReferences,
            numSegmentReferences,
            radius: markerRadius(numMetadataReferences, numSegmentReferences),
            color: color(colorMap, location),
        };
    });

    return markers;
}

function isEmpty(geoCoordinate) {
    return (!geoCoordinate || geoCoordinate.length === 0);
}

function markerRadius(numMetadataReferences, numSegmentReferences) {
    return Math.cbrt(numMetadataReferences + 3) * 4;
}

function color(colorMap, location) {
    const typesArray = location.ref_types.split(',');

    const typesWithoutSegmentRefs = new Set(typesArray);
    typesWithoutSegmentRefs.delete('S');

    if (typesWithoutSegmentRefs.size > 1) {
        return MARKER_COLOR_MULTIPLE_TYPES;
    } else {
        const type = typesArray[0];

        return colorMap.get(type);
    }
}
