import { MARKER_COLOR_MULTIPLE_TYPES, MARKER_COLOR_SEGMENT_TYPE } from '../constants';

export default function transformIntoMarkers(colorMap, locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const markers = locations.map(location => {
        if (isEmpty(location.lat) || isEmpty(location.lon)) {
            throw new ReferenceError(`Lat/Lon values are empty for id ${location.id}`);
        }

        const numReferences = location.ref_types.split(',').length;

        return {
            id: location.id,
            lat: Number.parseFloat(location.lat),
            long: Number.parseFloat(location.lon),
            name: location.name,
            numReferences,
            radius: markerRadius(numReferences),
            color: color(colorMap, location),
        };
    });

    return markers;
}

function isEmpty(geoCoordinate) {
    return (!geoCoordinate || geoCoordinate.length === 0);
}

function markerRadius(numReferences) {
    return Math.cbrt(numReferences + 3) * 4;
}

function color(colorMap, location) {
    const typesArray = location.ref_types.split(',');

    if ((new Set(typesArray)).size > 1) {
        return MARKER_COLOR_MULTIPLE_TYPES;
    } else {
        const type = location.ref_types.split(',')[0];

        if (type === 'S') {
            return MARKER_COLOR_SEGMENT_TYPE;
        } else {
            return colorMap.get(Number.parseInt(type));
        }
    }
}
