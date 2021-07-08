/**
 * Merges locations for segments and for the interviewee which are
 * just concatenated on the server.
 *
 * @param {array} registry entries from the server
 * @return {array} markers for map component
 */
export default function transformIntoMarkers(locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const mergedLocations = mergeLocations(locations);
    const markers = mergedLocations.map(location => ({
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

/**
 * Merges locations for segments and for the interviewee which are
 * just concatenated on the server.
 */
function mergeLocations(locations) {
    const mergedLocations = locations.reduce((acc, location) => {
        if (location.id in acc) {
            const storedLocation = acc[location.id];
            storedLocation.ref_types = `${storedLocation.ref_types},${location.ref_types}`;
        } else {
            acc[location.id] = {
                ...location, // Clone because state is mutated above.
            };
        }
        return acc;
    }, {});

    return Object.values(mergedLocations);
}
