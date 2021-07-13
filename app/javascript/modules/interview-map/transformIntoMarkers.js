export default function transformIntoMarkers(colorMap, locations) {
    console.log(colorMap, locations);

    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const markers = locations.map(location => {
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

function markerRadius(numReferences) {
    return Math.cbrt(numReferences + 3) * 4;
}

function color(colorMap, location) {
    const typesArray = location.ref_types.split(',');

    if ((new Set(typesArray)).size > 1) {
        return 'black';
    } else {
        const type = location.ref_types.split(',')[0];

        if (type === 'Segment') {
            return 'var(--primary-color)';
        } else {
            return colorMap.get(Number.parseInt(type));
        }
    }
}
