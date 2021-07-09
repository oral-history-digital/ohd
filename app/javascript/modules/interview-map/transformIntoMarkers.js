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
