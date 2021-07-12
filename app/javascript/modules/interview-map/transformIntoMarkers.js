export default function transformIntoMarkers(locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const markers = locations.map(location => ({
        id: location.id,
        lat: Number.parseFloat(location.lat),
        long: Number.parseFloat(location.lon),
        name: location.name,
        numReferences: location.ref_types.split(',').length,
        radius: 7.5,
        color: 'red',
    }));

    return markers;
}
